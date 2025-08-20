import React, { useState, useEffect, useCallback } from 'react';
import { FileExplorer } from './components/FileExplorer';
import { Editor } from './components/Editor';
import { Header } from './components/Header';
import { ConfirmationModal } from './components/ConfirmationModal';
import { useAutoSave } from './hooks/useAutoSave';
import styles from './styles/App.module.css';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileItem[];
}

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const MIN_SIDEBAR_WIDTH = 200;
  const MAX_SIDEBAR_WIDTH = 600;
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('sidebarWidth');
      const parsed = stored ? parseInt(stored, 10) : 300;
      if (!isFinite(parsed)) return 300;
      return Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, parsed));
    } catch {
      return 300;
    }
  });
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // URL state management functions
  const getFilePathFromURL = useCallback(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      return decodeURIComponent(hash.slice(2)) || null;
    }
    return null;
  }, []);

  const updateURL = useCallback((filePath: string | null) => {
    if (filePath) {
      const encodedPath = encodeURIComponent(filePath);
      window.history.pushState({ filePath }, '', `#/${encodedPath}`);
    } else {
      window.history.pushState({}, '', window.location.pathname);
    }
  }, []);

  const saveFile = useCallback(async (content: string, filePath: string) => {
    const response = await fetch(`/api/files/${filePath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save file');
    }
  }, []);

  const { isSaving, hasUnsavedChanges, saveNow } = useAutoSave({
    content: fileContent,
    filePath: selectedFile,
    onSave: saveFile,
    delay: 5000,
  });

  const loadFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  }, []);

  const loadFileContent = useCallback(async (filePath: string) => {
    try {
      const response = await fetch(`/api/files/${filePath}`);
      const data = await response.json();
      setFileContent(data.content);
    } catch (error) {
      console.error('Failed to load file content:', error);
      setFileContent('');
    }
  }, []);

  const handleFileSelect = useCallback((filePath: string) => {
    setSelectedFile(filePath);
    setIsPreviewMode(false);
    loadFileContent(filePath);
    updateURL(filePath);
  }, [loadFileContent, updateURL]);

  const handleCreateFile = useCallback(async (fileName: string, directory?: string) => {
    const fullPath = directory ? `${directory}/${fileName}` : fileName;
    try {
      const response = await fetch('/api/create-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: fullPath }),
      });
      
      if (response.ok) {
        await loadFiles();
        setSelectedFile(fullPath);
        setFileContent('');
        setIsPreviewMode(false);
        updateURL(fullPath);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create file');
      }
    } catch (error) {
      console.error('Failed to create file:', error);
      alert('Failed to create file');
    }
  }, [loadFiles, updateURL]);

  const handleCreateDirectory = useCallback(async (dirName: string, directory?: string) => {
    const fullPath = directory ? `${directory}/${dirName}` : dirName;
    try {
      const response = await fetch('/api/create-directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dirName: fullPath }),
      });
      
      if (response.ok) {
        await loadFiles();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create directory');
      }
    } catch (error) {
      console.error('Failed to create directory:', error);
      alert('Failed to create directory');
    }
  }, [loadFiles]);

  const handleDeleteFile = useCallback((filePath: string) => {
    const fileName = filePath.split('/').pop() || filePath;
    setConfirmModal({
      isOpen: true,
      title: 'Delete File',
      message: `Are you sure you want to delete '${fileName}'? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/files/${encodeURIComponent(filePath)}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            await loadFiles();
            // If the deleted file was selected, clear the selection
            if (selectedFile === filePath) {
              setSelectedFile(null);
              setFileContent('');
              setIsPreviewMode(false);
              window.history.pushState({}, '', window.location.pathname);
            }
          } else {
            const error = await response.json();
            alert(error.error || 'Failed to delete file');
          }
        } catch (error) {
          console.error('Failed to delete file:', error);
          alert('Failed to delete file');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [loadFiles, selectedFile]);

  const handleDeleteDirectory = useCallback((dirPath: string) => {
    const dirName = dirPath.split('/').pop() || dirPath;
    setConfirmModal({
      isOpen: true,
      title: 'Delete Folder',
      message: `Are you sure you want to delete the folder '${dirName}' and all its contents? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/directories/${encodeURIComponent(dirPath)}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            await loadFiles();
            // If the deleted directory contained the selected file, clear the selection
            if (selectedFile && selectedFile.startsWith(dirPath + '/')) {
              setSelectedFile(null);
              setFileContent('');
              setIsPreviewMode(false);
              window.history.pushState({}, '', window.location.pathname);
            }
          } else {
            const error = await response.json();
            alert(error.error || 'Failed to delete directory');
          }
        } catch (error) {
          console.error('Failed to delete directory:', error);
          alert('Failed to delete directory');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [loadFiles, selectedFile]);

  const handleRenamePath = useCallback(async (oldPath: string, newPath: string) => {
    try {
      const response = await fetch('/api/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newPath }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(err.error || 'Failed to rename');
        return false;
      }
      await loadFiles();
      // Update selection and URL if needed
      if (selectedFile) {
        if (selectedFile === oldPath) {
          setSelectedFile(newPath);
          updateURL(newPath);
          await loadFileContent(newPath);
        } else if (selectedFile.startsWith(oldPath + '/')) {
          const suffix = selectedFile.slice(oldPath.length);
          const updated = newPath + suffix;
          setSelectedFile(updated);
          updateURL(updated);
          await loadFileContent(updated);
        }
      }
      return true;
    } catch (error) {
      console.error('Failed to rename:', error);
      alert('Failed to rename');
      return false;
    }
  }, [loadFiles, selectedFile, updateURL, loadFileContent]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Track viewport size for responsive behavior
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Persist sidebar width
  useEffect(() => {
    try {
      localStorage.setItem('sidebarWidth', String(sidebarWidth));
    } catch {}
  }, [sidebarWidth]);

  // Handle drag-to-resize events
  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(
        MIN_SIDEBAR_WIDTH,
        Math.min(MAX_SIDEBAR_WIDTH, e.clientX)
      );
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Handle initial URL parsing and browser navigation
  useEffect(() => {
    const loadFileFromURL = async () => {
      const filePath = getFilePathFromURL();
      if (filePath) {
        setSelectedFile(filePath);
        setIsPreviewMode(false);
        await loadFileContent(filePath);
      }
    };

    // Load file from initial URL
    loadFileFromURL();

    // Handle browser back/forward navigation
    const handlePopState = (event: PopStateEvent) => {
      const filePath = getFilePathFromURL();
      if (filePath && filePath !== selectedFile) {
        setSelectedFile(filePath);
        setIsPreviewMode(false);
        loadFileContent(filePath);
      } else if (!filePath && selectedFile) {
        setSelectedFile(null);
        setFileContent('');
        setIsPreviewMode(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [getFilePathFromURL, loadFileContent, selectedFile]);

  return (
    <div className={styles.app}>
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        hasSelectedFile={!!selectedFile}
        fileContent={fileContent}
        fileName={selectedFile}
      />
      {/* Mobile backdrop to close sidebar */}
      {isSidebarOpen && (
        <div
          className={`${styles.backdrop} ${styles.backdropOpen}`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={`${styles.body} ${isResizing ? styles.resizing : ''}`}>
        {isSidebarOpen && (
          <>
          <div className={styles.sidebar} style={isMobile ? undefined : { width: sidebarWidth }}>
            <FileExplorer
              files={files}
              onFileSelect={handleFileSelect}
              onCreateFile={handleCreateFile}
              onCreateDirectory={handleCreateDirectory}
              onDeleteFile={handleDeleteFile}
              onDeleteDirectory={handleDeleteDirectory}
              selectedFile={selectedFile}
              onRenamePath={handleRenamePath}
            />
          </div>
          <div 
            className={styles.resizer}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
          />
          </>
        )}
        <div className={styles.main}>
          <Editor
            content={fileContent}
            onChange={setFileContent}
            isPreviewMode={isPreviewMode}
            isSaving={isSaving}
            hasUnsavedChanges={hasUnsavedChanges}
            onManualSave={saveNow}
            fileName={selectedFile}
          />
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        danger={true}
      />
    </div>
  );
}

export default App;
