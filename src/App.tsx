import React, { useState, useEffect, useCallback } from 'react';
import { FileExplorer } from './components/FileExplorer';
import { Editor } from './components/Editor';
import { Header } from './components/Header';
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

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

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
      />
      
      <div className={styles.body}>
        {isSidebarOpen && (
          <div className={styles.sidebar}>
            <FileExplorer
              files={files}
              onFileSelect={handleFileSelect}
              onCreateFile={handleCreateFile}
              onCreateDirectory={handleCreateDirectory}
              selectedFile={selectedFile}
            />
          </div>
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
    </div>
  );
}

export default App;