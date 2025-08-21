import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FileExplorer } from './components/FileExplorer';
import { Editor } from './components/Editor';
import { MarkdownPreview } from './components/MarkdownPreview';
import { Header } from './components/Header';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SettingsModal, PreviewLayout, SidebarMode } from './components/SettingsModal';
import { useAutoSave } from './hooks/useAutoSave';
import styles from './styles/App.module.css';
import { Toast } from './components/Toast';

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
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('previewMode');
      return stored ? stored === 'true' : false;
    } catch {
      return false;
    }
  });
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
  const [isSplitResizing, setIsSplitResizing] = useState<boolean>(false);
  const MIN_SPLIT_LEFT = 200;
  const MIN_SPLIT_RIGHT = 200;
  const [splitWidth, setSplitWidth] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('splitWidth');
      const parsed = stored ? parseInt(stored, 10) : NaN;
      return Number.isFinite(parsed) ? parsed : 600;
    } catch {
      return 600;
    }
  });
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'error' | 'success' } | null>(null);
  const [aiPending, setAiPending] = useState<boolean>(false);
  const [aiPrevContent, setAiPrevContent] = useState<string | null>(null);
  const openAiModal = () => {
    try { window.dispatchEvent(new CustomEvent('open-ai-modal')); } catch {}
  };
  // Scroll sync refs
  const setEditorScrollRef = useRef<(r: number) => void>(() => {});
  const setPreviewScrollRef = useRef<(r: number) => void>(() => {});
  const [scrollSync, setScrollSync] = useState<boolean>(() => {
    try { const v = localStorage.getItem('scrollSync'); return v ? v === 'true' : true; } catch { return true; }
  });
  const canSync = (isPreviewMode && !isMobile && previewLayout === 'split' && scrollSync);
  const handleEditorScrollRatio = (r: number) => {
    if (!canSync) return;
    setPreviewScrollRef.current && setPreviewScrollRef.current(r);
  };
  const handlePreviewScrollRatio = (r: number) => {
    if (!canSync) return;
    setEditorScrollRef.current && setEditorScrollRef.current(r);
  };
  const pendingSettingsRef = useRef<Record<string, unknown>>({});
  const settingsTimerRef = useRef<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);
  const [previewLayout, setPreviewLayout] = useState<PreviewLayout>(() => {
    try {
      const v = localStorage.getItem('previewLayout');
      return (v === 'split' || v === 'full') ? (v as PreviewLayout) : 'full';
    } catch {
      return 'full';
    }
  });
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(() => {
    try {
      const v = localStorage.getItem('sidebarMode');
      return (v === 'overlay' || v === 'inline') ? (v as SidebarMode) : 'overlay';
    } catch {
      return 'overlay';
    }
  });
  const [openAiModel, setOpenAiModel] = useState<string>(() => {
    try {
      return localStorage.getItem('openAiModel') || 'gpt-5-mini';
    } catch {
      return 'gpt-5-mini';
    }
  });

  // Load persisted settings from server
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/settings', { credentials: 'same-origin' });
        if (!res.ok) throw new Error('settings load failed');
        const s = await res.json();
        if (cancelled) return;
        if (s && (s.previewLayout === 'full' || s.previewLayout === 'split')) setPreviewLayout(s.previewLayout);
        if (s && (s.sidebarMode === 'overlay' || s.sidebarMode === 'inline')) setSidebarMode(s.sidebarMode);
        if (s && typeof s.openAiModel === 'string') setOpenAiModel(s.openAiModel);
        if (s && typeof s.scrollSync === 'boolean') setScrollSync(s.scrollSync);
      } catch {}
      finally {
        if (!cancelled) setSettingsLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const showToast = useCallback((message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToast({ message, type });
  }, []);
  
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
    const response = await fetch(`/api/files/${encodeURIComponent(filePath)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
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
    paused: aiPending,
  });

  const loadFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/files', { credentials: 'same-origin' });
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  }, []);

  const loadFileContent = useCallback(async (filePath: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/files/${encodeURIComponent(filePath)}`, { credentials: 'same-origin' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (!data || typeof data.content !== 'string') {
        throw new Error('Invalid response');
      }
      setFileContent(data.content);
      return true;
    } catch (error) {
      console.error('Failed to load file content:', error);
      setFileContent('');
      return false;
    }
  }, []);

  const handleFileSelect = useCallback(async (filePath: string) => {
    const ok = await loadFileContent(filePath);
    if (!ok) {
      // If it fails, clear selection and URL
      setSelectedFile(null);
      setIsPreviewMode(false);
      setFileContent('');
      updateURL(null);
      showToast('Could not open file. Returning to home.', 'error');
      return;
    }
    setSelectedFile(filePath);
    // Keep current preview mode as-is
    // Close sidebar if overlay (desktop) or on mobile
    if (isMobile || sidebarMode === 'overlay') {
      setIsSidebarOpen(false);
    }
    updateURL(filePath);
  }, [loadFileContent, updateURL, showToast, isMobile, sidebarMode]);

  const handleCreateFile = useCallback(async (fileName: string, directory?: string) => {
    const fullPath = directory ? `${directory}/${fileName}` : fileName;
    try {
      const response = await fetch('/api/create-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ fileName: fullPath }),
      });
      
      if (response.ok) {
        await loadFiles();
        setSelectedFile(fullPath);
        setFileContent('');
        // Keep preview mode as-is
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
        credentials: 'same-origin',
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
            credentials: 'same-origin',
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
            credentials: 'same-origin',
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
        credentials: 'same-origin',
        body: JSON.stringify({ oldPath, newPath }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        showToast(err.error || 'Failed to rename', 'error');
        return false;
      }
      await loadFiles();
      // Update selection and URL if needed
      if (selectedFile) {
        if (selectedFile === oldPath) {
          const ok = await loadFileContent(newPath);
          if (ok) {
            setSelectedFile(newPath);
            updateURL(newPath);
          } else {
            setSelectedFile(null);
            setFileContent('');
            updateURL(null);
            showToast('Renamed, but failed to open the new path.', 'error');
          }
        } else if (selectedFile.startsWith(oldPath + '/')) {
          const suffix = selectedFile.slice(oldPath.length);
          const updated = newPath + suffix;
          const ok = await loadFileContent(updated);
          if (ok) {
            setSelectedFile(updated);
            updateURL(updated);
          } else {
            setSelectedFile(null);
            setFileContent('');
            updateURL(null);
            showToast('Renamed folder, but failed to open nested file.', 'error');
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Failed to rename:', error);
      showToast('Failed to rename', 'error');
      return false;
    }
  }, [loadFiles, selectedFile, updateURL, loadFileContent, showToast]);

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

  // Initialize split width to half of container if not set
  useEffect(() => {
    if (!mainRef.current) return;
    try {
      const stored = localStorage.getItem('splitWidth');
      if (!stored) {
        const rect = mainRef.current.getBoundingClientRect();
        if (rect.width) setSplitWidth(Math.max(MIN_SPLIT_LEFT, Math.min(rect.width - MIN_SPLIT_RIGHT, rect.width / 2)));
      }
    } catch {}
  }, []);

  // Persist split width
  useEffect(() => {
    try {
      localStorage.setItem('splitWidth', String(splitWidth));
    } catch {}
  }, [splitWidth]);

  // Persist preview mode preference
  useEffect(() => {
    try {
      localStorage.setItem('previewMode', String(isPreviewMode));
    } catch {}
  }, [isPreviewMode]);

  useEffect(() => {
    try {
      localStorage.setItem('previewLayout', previewLayout);
    } catch {}
    // Queue a debounced settings persist
    if (settingsLoaded) queueSettingsUpdate({ previewLayout });
  }, [previewLayout]);

  useEffect(() => {
    try {
      localStorage.setItem('sidebarMode', sidebarMode);
    } catch {}
    if (settingsLoaded) queueSettingsUpdate({ sidebarMode });
  }, [sidebarMode]);

  useEffect(() => {
    try {
      localStorage.setItem('openAiModel', openAiModel);
    } catch {}
    if (settingsLoaded) queueSettingsUpdate({ openAiModel });
  }, [openAiModel]);

  useEffect(() => {
    try { localStorage.setItem('scrollSync', String(scrollSync)); } catch {}
    if (settingsLoaded) queueSettingsUpdate({ scrollSync });
  }, [scrollSync]);

  const flushSettings = useCallback(async () => {
    const payload = pendingSettingsRef.current;
    pendingSettingsRef.current = {};
    settingsTimerRef.current = null;
    if (!payload || Object.keys(payload).length === 0) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast('Settings saved', 'success');
      }
    } catch {}
  }, [showToast]);

  const queueSettingsUpdate = useCallback((partial: Record<string, unknown>) => {
    pendingSettingsRef.current = { ...pendingSettingsRef.current, ...partial };
    if (settingsTimerRef.current) {
      window.clearTimeout(settingsTimerRef.current);
    }
    settingsTimerRef.current = window.setTimeout(flushSettings, 600);
  }, [flushSettings]);

  useEffect(() => {
    return () => {
      if (settingsTimerRef.current) {
        window.clearTimeout(settingsTimerRef.current);
      }
    };
  }, []);

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

  // Handle split drag-to-resize events
  useEffect(() => {
    if (!isSplitResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      const min = MIN_SPLIT_LEFT;
      const max = rect.width - MIN_SPLIT_RIGHT;
      x = Math.max(min, Math.min(max, x));
      setSplitWidth(x);
    };
    const handleMouseUp = () => setIsSplitResizing(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSplitResizing]);

  // Handle initial URL parsing and browser navigation
  useEffect(() => {
    const loadFileFromURL = async () => {
      const filePath = getFilePathFromURL();
      if (filePath) {
        const ok = await loadFileContent(filePath);
        if (ok) {
          setSelectedFile(filePath);
          if (isMobile) {
            setIsSidebarOpen(false);
          }
        } else {
          setSelectedFile(null);
          setFileContent('');
          updateURL(null);
          showToast('Could not open file from URL. Returning to home.', 'error');
        }
      }
    };

    // Load file from initial URL
    loadFileFromURL();

    // Handle browser back/forward navigation
    const handlePopState = async (event: PopStateEvent) => {
      const filePath = getFilePathFromURL();
      if (filePath && filePath !== selectedFile) {
        const ok = await loadFileContent(filePath);
        if (ok) {
          setSelectedFile(filePath);
          if (isMobile) {
            setIsSidebarOpen(false);
          }
        } else {
          setSelectedFile(null);
          setFileContent('');
          updateURL(null);
          showToast('Could not open file. Returning to home.', 'error');
        }
      } else if (!filePath && selectedFile) {
        setSelectedFile(null);
        setFileContent('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [getFilePathFromURL, loadFileContent, selectedFile, updateURL, showToast, isMobile]);

  return (
    <div className={styles.app}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
        onOpenAI={openAiModal}
        showAiReview={aiPrevContent !== null}
        onAcceptAI={async () => { try { await saveNow(); } catch {}; setAiPrevContent(null); setAiPending(false); }}
        onRejectAI={() => { if (aiPrevContent !== null) { setFileContent(aiPrevContent); } setAiPrevContent(null); setAiPending(false); }}
      />
      {/* Backdrop to close sidebar (mobile always; desktop only in overlay mode) */}
      {isSidebarOpen && (
        <div
          className={`${styles.backdrop} ${(isMobile || sidebarMode === 'overlay') ? styles.backdropOpen : ''} ${( !isMobile && sidebarMode === 'overlay') ? styles.backdropOverlay : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={`${styles.body} ${(isResizing || isSplitResizing) ? styles.resizing : ''}`}>
        {isSidebarOpen && (
          <>
          <div 
            className={`${styles.sidebar} ${(!isMobile && sidebarMode === 'overlay') ? styles.sidebarOverlay : ''}`}
            style={(!isMobile && sidebarMode === 'inline') ? { width: sidebarWidth } : undefined}
          >
            <FileExplorer
              files={files}
              onFileSelect={handleFileSelect}
              onCreateFile={handleCreateFile}
              onCreateDirectory={handleCreateDirectory}
              onDeleteFile={handleDeleteFile}
              onDeleteDirectory={handleDeleteDirectory}
              selectedFile={selectedFile}
              onRenamePath={handleRenamePath}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </div>
          {(sidebarMode === 'inline' && !isMobile) && (
            <div 
              className={styles.resizer}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize sidebar"
              onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
            />
          )}
          </>
        )}
        <div className={styles.main}>
          {(isPreviewMode && !isMobile && previewLayout === 'split') ? (
            <div className={styles.splitMain} ref={mainRef}>
              <div className={styles.pane} style={{ width: splitWidth, flex: '0 0 auto' }}>
                <Editor
                  content={fileContent}
                  onChange={setFileContent}
                  isPreviewMode={false}
                  isSaving={isSaving}
                  hasUnsavedChanges={hasUnsavedChanges}
                  onManualSave={saveNow}
                  fileName={selectedFile}
                  onAiPendingChange={setAiPending}
                  defaultModel={openAiModel}
                  onAiApply={(newContent) => { setAiPrevContent(fileContent); setFileContent(newContent); setAiPending(true); }}
                  enableScrollSync={canSync}
                  onScrollRatio={handleEditorScrollRatio}
                  registerSetScroll={(fn) => { setEditorScrollRef.current = fn; }}
                />
              </div>
              <div
                className={styles.resizer}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize editor/preview"
                onMouseDown={(e) => { e.preventDefault(); setIsSplitResizing(true); }}
                onDoubleClick={() => {
                  if (!mainRef.current) return;
                  const rect = mainRef.current.getBoundingClientRect();
                  const target = Math.max(MIN_SPLIT_LEFT, Math.min(rect.width - MIN_SPLIT_RIGHT, rect.width / 2));
                  setSplitWidth(target);
                }}
              />
              <div className={styles.pane}>
                {selectedFile ? (
                  <MarkdownPreview
                    content={fileContent}
                    enableScrollSync={canSync}
                    onScrollRatio={handlePreviewScrollRatio}
                    registerSetScroll={(fn) => { setPreviewScrollRef.current = fn; }}
                  />
                ) : null}
              </div>
            </div>
          ) : isPreviewMode ? (
            // Mobile: show preview full width
            <MarkdownPreview content={fileContent} />
          ) : (
            <Editor
              content={fileContent}
              onChange={setFileContent}
              isPreviewMode={false}
              isSaving={isSaving}
              hasUnsavedChanges={hasUnsavedChanges}
              onManualSave={saveNow}
              fileName={selectedFile}
              onAiPendingChange={setAiPending}
              defaultModel={openAiModel}
              onAiApply={(newContent) => { setAiPrevContent(fileContent); setFileContent(newContent); setAiPending(true); }}
              enableScrollSync={false}
            />
          )}
        </div>
      </div>
      
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        previewLayout={previewLayout}
        onChangePreviewLayout={setPreviewLayout}
        sidebarMode={sidebarMode}
        onChangeSidebarMode={setSidebarMode}
        openAiModel={openAiModel}
        onChangeOpenAiModel={setOpenAiModel}
        onPersistSettings={(partial) => queueSettingsUpdate(partial)}
        scrollSync={scrollSync}
        onChangeScrollSync={setScrollSync}
      />

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
