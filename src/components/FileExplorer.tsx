import React, { useState } from 'react';
import styles from '../styles/FileExplorer.module.css';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileItem[];
}

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (path: string) => void;
  onCreateFile: (fileName: string, directory?: string) => void;
  onCreateDirectory: (dirName: string, directory?: string) => void;
  onDeleteFile: (filePath: string) => void;
  onDeleteDirectory: (dirPath: string) => void;
  selectedFile: string | null;
}

export function FileExplorer({ 
  files, 
  onFileSelect, 
  onCreateFile, 
  onCreateDirectory, 
  onDeleteFile,
  onDeleteDirectory,
  selectedFile 
}: FileExplorerProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [showCreateFile, setShowCreateFile] = useState<string | null>(null);
  const [showCreateDir, setShowCreateDir] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newDirName, setNewDirName] = useState('');

  const toggleDirectory = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
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
    const isExpanded = expandedDirs.has(item.path);
    const isSelected = selectedFile === item.path;

    return (
      <div key={item.path}>
        <div 
          className={`${styles.fileItem} ${isSelected ? styles.selected : ''}`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {item.type === 'directory' ? (
            <div className={styles.directoryContainer}>
              <div 
                className={styles.directory}
                onClick={() => toggleDirectory(item.path)}
              >
                <span className={styles.icon}>
                  {isExpanded ? '📂' : '📁'}
                </span>
                <span>{item.name}</span>
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
                className={styles.file}
                onClick={() => onFileSelect(item.path)}
              >
                <span className={styles.icon}>📄</span>
                <span>{item.name}</span>
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

      <div className={styles.fileList}>
        {files.map(file => renderFileItem(file))}
      </div>
    </div>
  );
}