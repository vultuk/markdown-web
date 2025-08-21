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
  onOpenAI?: () => void;
  showAiReview?: boolean;
  onAcceptAI?: () => void;
  onRejectAI?: () => void;
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
  fileName,
  onOpenAI,
  showAiReview = false,
  onAcceptAI,
  onRejectAI,
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
              aria-label={isPreviewMode ? 'Switch to Edit' : 'Switch to Preview'}
              title={isPreviewMode ? 'Edit' : 'Preview'}
            >
              <span className={styles.btnIcon} aria-hidden>
                {isPreviewMode ? '✏️' : '👁️'}
              </span>
              <span className={styles.btnLabel}>{isPreviewMode ? 'Edit' : 'Preview'}</span>
            </button>
            {showAiReview ? (
              <>
                <button 
                  className={styles.toggleButton}
                  onClick={onAcceptAI}
                  aria-label="Accept changes"
                  title="Accept changes"
                >
                  <span className={styles.btnIcon} aria-hidden>✅</span>
                  <span className={styles.btnLabel}>Accept</span>
                </button>
                <button 
                  className={styles.toggleButton}
                  onClick={onRejectAI}
                  aria-label="Revert changes"
                  title="Revert changes"
                >
                  <span className={styles.btnIcon} aria-hidden>↩️</span>
                  <span className={styles.btnLabel}>Revert</span>
                </button>
              </>
            ) : (
              <button 
                className={styles.toggleButton}
                onClick={onOpenAI}
                aria-label="Open AI assistant"
                title="Open AI assistant"
              >
                <span className={styles.btnIcon} aria-hidden>✨</span>
                <span className={styles.btnLabel}>AI</span>
              </button>
            )}
            <ExportButton content={fileContent} fileName={fileName} isPreviewMode={isPreviewMode} />
          </>
        )}
      </div>
    </header>
  );
}
