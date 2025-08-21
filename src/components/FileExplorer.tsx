import React, { useState } from 'react';
import styles from '../styles/FileExplorer.module.css';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileItem[];
  isGitRepo?: boolean;
  gitStatus?: 'untracked' | 'modified' | 'deleted';
  gitSummary?: { hasUnstaged?: boolean; hasStaged?: boolean };
}

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (path: string) => void;
  onCreateFile: (fileName: string, directory?: string) => void;
  onCreateDirectory: (dirName: string, directory?: string) => void;
  onDeleteFile: (filePath: string) => void;
  onDeleteDirectory: (dirPath: string) => void;
  selectedFile: string | null;
  onRenamePath: (oldPath: string, newPath: string) => Promise<boolean>;
  onOpenSettings?: () => void;
  expandedDirs?: string[];
  onExpandedChange?: (paths: string[]) => void;
  onRefreshFiles?: () => void;
}

export function FileExplorer({ 
  files, 
  onFileSelect, 
  onCreateFile, 
  onCreateDirectory, 
  onDeleteFile,
  onDeleteDirectory,
  selectedFile,
  onRenamePath,
  onOpenSettings,
  expandedDirs: expandedDirsProp,
  onExpandedChange,
  onRefreshFiles,
}: FileExplorerProps) {
  const [expandedDirsSet, setExpandedDirsSet] = useState<Set<string>>(() => new Set(expandedDirsProp || []));
  React.useEffect(() => {
    if (expandedDirsProp) {
      setExpandedDirsSet(new Set(expandedDirsProp));
    }
  }, [expandedDirsProp]);
  const [showCreateFile, setShowCreateFile] = useState<string | null>(null);
  const [showCreateDir, setShowCreateDir] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newDirName, setNewDirName] = useState('');
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [menu, setMenu] = useState<{ open: boolean; x: number; y: number; type: 'file' | 'directory' | 'root'; path?: string } | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [commitModal, setCommitModal] = useState<{ open: boolean; repoPath: string; title: string; message: string } | null>(null);
  const [cloneModal, setCloneModal] = useState<{ open: boolean; baseDir: string; url: string; name: string } | null>(null);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const openMenuAtEvent = (e: React.MouseEvent, type: 'file' | 'directory' | 'root', path?: string) => {
    e.preventDefault();
    e.stopPropagation();
    let x = (e as any).clientX as number | undefined;
    let y = (e as any).clientY as number | undefined;
    if (!x || !y) {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      x = rect.left + rect.width * 0.4;
      y = rect.top + rect.height;
    }
    setMenu({ open: true, x: x!, y: y!, type, path });
  };

  // Close context menu on click/escape/scroll
  React.useEffect(() => {
    const handleClick = () => setMenu(null);
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(null); };
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);
  const [draggingPath, setDraggingPath] = useState<string | null>(null);
  const [dragOverDir, setDragOverDir] = useState<string | null>(null);

  const basename = (p: string) => p.split('/').pop() || p;
  const isAncestor = (parent: string, child: string) => child.startsWith(parent + '/');
  const findNodeByPath = (list: FileItem[], p: string): FileItem | null => {
    for (const it of list) {
      if (it.path === p) return it;
      if (it.children) {
        const sub = findNodeByPath(it.children, p);
        if (sub) return sub;
      }
    }
    return null;
  };

  const toggleDirectory = (path: string) => {
    const newExpanded = new Set(expandedDirsSet);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirsSet(newExpanded);
    onExpandedChange?.(Array.from(newExpanded));
  };

  const handleCreateFile = (directory?: string) => {
    if (newFileName.trim()) {
      const fileName = newFileName.endsWith('.md') ? newFileName : `${newFileName}.md`;
      onCreateFile(fileName, directory || undefined);
      setNewFileName('');
      setShowCreateFile(null);
    }
  };

  const handleCreateDirectory = (directory?: string) => {
    if (newDirName.trim()) {
      onCreateDirectory(newDirName, directory || undefined);
      setNewDirName('');
      setShowCreateDir(null);
    }
  };

  const renderFileItem = (item: FileItem, level = 0) => {
    const isExpanded = expandedDirsSet.has(item.path);
    const isSelected = selectedFile === item.path;
    const isRenaming = renamingPath === item.path;

    const startRename = () => {
      setRenamingPath(item.path);
      setRenameValue(item.name);
    };

    const commitRename = async () => {
      const trimmed = renameValue.trim();
      if (!trimmed || trimmed === item.name) {
        setRenamingPath(null);
        return;
      }
      // Compute new path in same directory
      const dir = item.path.includes('/') ? item.path.slice(0, item.path.lastIndexOf('/')) : '';
      let newName = trimmed;
      if (item.type === 'file' && !/\.md$/i.test(newName)) {
        newName += '.md';
      }
      const newPath = dir ? `${dir}/${newName}` : newName;
      const ok = await onRenamePath(item.path, newPath);
      if (!ok) {
        // keep editing on failure
        return;
      }
      setRenamingPath(null);
    };

    const cancelRename = () => {
      setRenamingPath(null);
    };

    return (
      <div key={item.path}>
        <div 
          className={`${styles.fileItem} ${isSelected ? styles.selected : ''}`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {item.type === 'directory' ? (
            <div className={styles.directoryContainer}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenu({ open: true, x: e.clientX, y: e.clientY, type: 'directory', path: item.path });
              }}
              onDoubleClick={(e) => {
                if (isMobile) openMenuAtEvent(e, 'directory', item.path);
              }}
            >
              <div 
                className={
                  [
                    styles.directory,
                    draggingPath === item.path ? styles.dragging : '',
                    dragOverDir === item.path ? styles.dropTarget : '',
                    item.isGitRepo && item.gitSummary?.hasUnstaged ? styles.gitRepoUnstaged : '',
                    item.isGitRepo && !item.gitSummary?.hasUnstaged && item.gitSummary?.hasStaged ? styles.gitRepoStaged : '',
                  ].filter(Boolean).join(' ')
                }
                onClick={() => toggleDirectory(item.path)}
                draggable
                onDragStart={(e) => {
                  setDraggingPath(item.path);
                  try { e.dataTransfer.setData('text/plain', item.path); } catch {}
                  try { e.dataTransfer.effectAllowed = 'move'; } catch {}
                }}
                onDragEnd={() => { setDraggingPath(null); setDragOverDir(null); }}
                onDragOver={(e) => {
                  if (!draggingPath) return;
                  if (item.path === draggingPath) return;
                  e.preventDefault();
                  try { e.dataTransfer.dropEffect = 'move'; } catch {}
                  setDragOverDir(item.path);
                  // auto-expand on hover
                  if (!expandedDirsSet.has(item.path)) {
                    const next = new Set(expandedDirsSet); next.add(item.path); setExpandedDirsSet(next); onExpandedChange?.(Array.from(next));
                  }
                }}
                onDragLeave={() => {
                  setDragOverDir((curr) => (curr === item.path ? null : curr));
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  const src = ((): string | null => {
                    try { return e.dataTransfer.getData('text/plain') || draggingPath; } catch { return draggingPath; }
                  })();
                  setDragOverDir(null);
                  if (!src) return;
                  // prevent dropping a folder into itself or its descendants
                  if (src === item.path || isAncestor(src, item.path)) { setDraggingPath(null); return; }
                  const dest = `${item.path}/${basename(src)}`;
                  await onRenamePath(src, dest);
                  setDraggingPath(null);
                }}
              >
                <span className={styles.icon}>
                  {isExpanded ? '📂' : '📁'}
                </span>
                {item.isGitRepo ? (
                  <span className={styles.gitBadge} title="Git repository" aria-label="Git repository" aria-hidden>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.19-3.37-1.19-.46-1.17-1.12-1.48-1.12-1.48-.91-.63.07-.62.07-.62 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.36 1.08 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.4.1 2.65.64.7 1.02 1.6 1.02 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/>
                    </svg>
                  </span>
                ) : null}
                {isRenaming ? (
                  <input
                    className={styles.renameInput}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename();
                      if (e.key === 'Escape') cancelRename();
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={(e) => {
                      if (isMobile) {
                        openMenuAtEvent(e as any, 'directory', item.path);
                      } else {
                        startRename();
                      }
                    }}
                  >
                    {item.name}
                  </span>
                )}
              </div>
              <div className={styles.directoryActions}>
                <button 
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCreateFile(item.path);
                  }}
                  title="Create file in this folder"
                >
                  📄+
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCreateDir(item.path);
                  }}
                  title="Create folder in this folder"
                >
                  📁+
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDirectory(item.path);
                  }}
                  title="Delete this folder"
                >
                  🗑️
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.fileContainer}>
              <div 
                className={
                  [
                    styles.file,
                    draggingPath === item.path ? styles.dragging : '',
                    item.gitStatus === 'untracked' ? styles.gitUntracked : '',
                    item.gitStatus === 'modified' ? styles.gitModified : '',
                    item.gitStatus === 'deleted' ? styles.gitDeleted : '',
                  ].filter(Boolean).join(' ')
                }
                onClick={() => onFileSelect(item.path)}
                draggable
                onDragStart={(e) => {
                  setDraggingPath(item.path);
                  try { e.dataTransfer.setData('text/plain', item.path); } catch {}
                  try { e.dataTransfer.effectAllowed = 'move'; } catch {}
                }}
                onDragEnd={() => { setDraggingPath(null); setDragOverDir(null); }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenu({ open: true, x: e.clientX, y: e.clientY, type: 'file', path: item.path });
                }}
                onDoubleClick={(e) => {
                  if (isMobile) openMenuAtEvent(e, 'file', item.path);
                }}
              >
                <span className={styles.icon}>📄</span>
                {isRenaming ? (
                  <input
                    className={styles.renameInput}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename();
                      if (e.key === 'Escape') cancelRename();
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={(e) => {
                      if (isMobile) {
                        openMenuAtEvent(e as any, 'file', item.path);
                      } else {
                        startRename();
                      }
                    }}
                  >
                    {item.name}
                  </span>
                )}
              </div>
              <div className={styles.fileActions}>
                <button 
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(item.path);
                  }}
                  title="Delete this file"
                >
                  🗑️
                </button>
              </div>
            </div>
          )}
        </div>
        
        {item.type === 'directory' && isExpanded && item.children && (
          <div>
            {item.children.map(child => renderFileItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.fileExplorer}>
      <div className={styles.header}>
        <h3>Files</h3>
        <div className={styles.buttons}>
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateFile('')}
            title="Create new file in root"
          >
            📄+
          </button>
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateDir('')}
            title="Create new folder in root"
          >
            📁+
          </button>
        </div>
      </div>

      {showCreateFile !== null && (
        <div className={styles.createForm}>
          <div className={styles.createFormHeader}>
            Create file in: {showCreateFile || 'root'}
          </div>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Enter file name"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFile(showCreateFile || undefined)}
            autoFocus
          />
          <div className={styles.formButtons}>
            <button onClick={() => handleCreateFile(showCreateFile || undefined)}>Create</button>
            <button onClick={() => {
              setShowCreateFile(null);
              setNewFileName('');
            }}>Cancel</button>
          </div>
        </div>
      )}

      {showCreateDir !== null && (
        <div className={styles.createForm}>
          <div className={styles.createFormHeader}>
            Create folder in: {showCreateDir || 'root'}
          </div>
          <input
            type="text"
            value={newDirName}
            onChange={(e) => setNewDirName(e.target.value)}
            placeholder="Enter folder name"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateDirectory(showCreateDir || undefined)}
            autoFocus
          />
          <div className={styles.formButtons}>
            <button onClick={() => handleCreateDirectory(showCreateDir || undefined)}>Create</button>
            <button onClick={() => {
              setShowCreateDir(null);
              setNewDirName('');
            }}>Cancel</button>
          </div>
        </div>
      )}

      <div
        className={styles.fileList}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenu({ open: true, x: e.clientX, y: e.clientY, type: 'root' });
        }}
        onDoubleClick={(e) => {
          if (isMobile) openMenuAtEvent(e as any, 'root');
        }}
      >
        {files.map(file => renderFileItem(file))}
      </div>

      {menu?.open && (
        <div
          className={styles.contextMenu}
          style={{ left: menu.x, top: menu.y, position: 'fixed' }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          {menu.type === 'directory' && (
            <>
              <button
                className={styles.contextItem}
                onClick={() => { setMenu(null); setShowCreateFile(menu.path || ''); }}
              >
                New File
              </button>
              <button
                className={styles.contextItem}
                onClick={() => { setMenu(null); setShowCreateDir(menu.path || ''); }}
              >
                New Folder
              </button>
              <button
                className={styles.contextItem}
                onClick={() => { setMenu(null); setCloneModal({ open: true, baseDir: menu.path || '', url: '', name: '' }); }}
              >
                Clone Repository…
              </button>
              <button
                className={styles.contextItem}
                onClick={() => {
                  setMenu(null);
                  if (menu.path) { setRenamingPath(menu.path); setRenameValue(basename(menu.path)); }
                }}
              >
                Rename Folder
              </button>
              {(() => {
                const repoPath = menu.path || '';
                const node = findNodeByPath(files, repoPath);
                if (node && node.isGitRepo) {
                  return (
                    <>
                      <button
                        className={styles.contextItem}
                        onClick={() => {
                          setMenu(null);
                          setCommitModal({ open: true, repoPath, title: '', message: '' });
                        }}
                      >
                        Commit…
                      </button>
                      <button
                        className={styles.contextItem}
                        onClick={async () => { setMenu(null); try {
                          const res = await fetch('/api/git/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ repoPath }) });
                          const data = await res.json().catch(() => ({}));
                          if (!res.ok) alert(data.error || 'Push failed'); else alert('Push complete');
                        } catch { alert('Push failed'); } }}
                      >
                        Push
                      </button>
                    </>
                  );
                }
                return null;
              })()}
              <button
                className={`${styles.contextItem} ${styles.danger}`}
                onClick={() => { setMenu(null); if (menu.path) onDeleteDirectory(menu.path); }}
              >
                Delete Folder
              </button>
            </>
          )}
          {menu.type === 'file' && (
            <>
              {(() => {
                const p = menu.path || '';
                const node = findNodeByPath(files, p);
                if (node && typeof node.gitStatus !== 'undefined') {
                  const label = node.gitStatus === 'untracked' ? 'Add to Git' : 'Stage changes';
                  return (
                    <button
                      className={styles.contextItem}
                      onClick={async () => {
                        setMenu(null);
                        try {
                          const res = await fetch('/api/git/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ path: p }) });
                          const data = await res.json().catch(() => ({}));
                          if (!res.ok) alert(data.error || 'Failed to stage');
                          onRefreshFiles && onRefreshFiles();
                        } catch { alert('Failed to stage'); }
                      }}
                    >
                      {label}
                    </button>
                  );
                }
                return null;
              })()}
              <button
                className={styles.contextItem}
                onClick={() => {
                  setMenu(null);
                  if (menu.path) { setRenamingPath(menu.path); setRenameValue(basename(menu.path)); }
                }}
              >
                Rename File
              </button>
              <button
                className={`${styles.contextItem} ${styles.danger}`}
                onClick={() => { setMenu(null); if (menu.path) onDeleteFile(menu.path); }}
              >
                Delete File
              </button>
            </>
          )}
          {menu.type === 'root' && (
            <>
              <button
                className={styles.contextItem}
                onClick={() => { setMenu(null); setShowCreateFile(''); }}
              >
                New File in root
              </button>
              <button
                className={styles.contextItem}
                onClick={() => { setMenu(null); setShowCreateDir(''); }}
              >
                New Folder in root
              </button>
              <button
                className={styles.contextItem}
                onClick={() => { setMenu(null); setCloneModal({ open: true, baseDir: '', url: '', name: '' }); }}
              >
                Clone Repository…
              </button>
            </>
          )}
        </div>
      )}

      {commitModal?.open && (
        <div className={styles.modalBackdrop} onClick={() => setCommitModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>Commit Changes</div>
            <div className={styles.modalBody}>
              <label className={styles.modalLabel}>Title</label>
              <input
                className={styles.modalInput}
                type="text"
                value={commitModal.title}
                onChange={(e) => setCommitModal({ ...commitModal, title: e.target.value })}
                placeholder="Short summary"
                autoFocus
              />
              <label className={styles.modalLabel}>Message (optional)</label>
              <textarea
                className={styles.modalTextarea}
                value={commitModal.message}
                onChange={(e) => setCommitModal({ ...commitModal, message: e.target.value })}
                placeholder="Details"
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.actionButton} onClick={() => setCommitModal(null)}>Cancel</button>
              <button
                className={styles.primaryButton}
                onClick={async () => {
                  if (!commitModal.title.trim()) { alert('Title is required'); return; }
                  try {
                    const res = await fetch('/api/git/commit', {
                      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
                      body: JSON.stringify({ repoPath: commitModal.repoPath, title: commitModal.title, message: commitModal.message })
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) { alert(data.error || 'Commit failed'); return; }
                    setCommitModal(null);
                    onRefreshFiles && onRefreshFiles();
                  } catch { alert('Commit failed'); }
                }}
              >
                Commit
              </button>
            </div>
          </div>
        </div>
      )}

      {cloneModal?.open && (
        <div className={styles.modalBackdrop} onClick={() => setCloneModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>Clone Repository</div>
            <div className={styles.modalBody}>
              <label className={styles.modalLabel}>Repository URL</label>
              <input
                className={styles.modalInput}
                type="text"
                value={cloneModal.url}
                onChange={(e) => setCloneModal({ ...cloneModal, url: e.target.value })}
                placeholder="https://github.com/user/repo.git"
                autoFocus
              />
              <label className={styles.modalLabel}>Folder name (optional)</label>
              <input
                className={styles.modalInput}
                type="text"
                value={cloneModal.name}
                onChange={(e) => setCloneModal({ ...cloneModal, name: e.target.value })}
                placeholder="Defaults to repository name"
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.actionButton} onClick={() => setCloneModal(null)}>Cancel</button>
              <button
                className={styles.primaryButton}
                onClick={async () => {
                  const url = cloneModal.url.trim();
                  if (!url) { alert('Repository URL is required'); return; }
                  try {
                    const res = await fetch('/api/git/clone', {
                      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
                      body: JSON.stringify({ url, directory: cloneModal.baseDir, name: cloneModal.name.trim() || undefined })
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) { alert(data.error || 'Clone failed'); return; }
                    setCloneModal(null);
                    onRefreshFiles && onRefreshFiles();
                  } catch { alert('Clone failed'); }
                }}
              >
                Clone
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <button 
          className={styles.settingsButton}
          onClick={() => onOpenSettings && onOpenSettings()}
          title="Settings"
          aria-label="Open settings"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
