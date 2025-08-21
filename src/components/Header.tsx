import React from 'react';
import { SaveIndicator } from './SaveIndicator';
import { ExportButton } from './ExportButton';
import styles from '../styles/Header.module.css';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  hasSelectedFile: boolean;
  fileContent?: string;
  fileName?: string | null;
}

export function Header({ 
  isSidebarOpen,
  onToggleSidebar,
  isPreviewMode, 
  onTogglePreview, 
  isSaving, 
  hasUnsavedChanges,
  hasSelectedFile,
  fileContent = '',
  fileName
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button 
          className={styles.hamburger}
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <div className={styles.hamburgerLine}></div>
          <div className={styles.hamburgerLine}></div>
          <div className={styles.hamburgerLine}></div>
        </button>
        <h1 className={styles.title}>Markdown Web Editor</h1>
      </div>
      
      <div className={styles.right}>
        {hasSelectedFile && (
          <>
            <SaveIndicator isSaving={isSaving} hasUnsavedChanges={hasUnsavedChanges} />
            <button 
              className={styles.toggleButton}
              onClick={onTogglePreview}
            >
              {isPreviewMode ? 'Edit' : 'Preview'}
            </button>
            <ExportButton content={fileContent} fileName={fileName} isPreviewMode={isPreviewMode} />
          </>
        )}
      </div>
    </header>
  );
}
