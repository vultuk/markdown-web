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
                {isPreviewMode ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 1.83H5v-0.92l8.06-8.06 0.92 0.92-8.06 8.06zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                  </svg>
                )}
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
                  <span className={styles.btnIcon} aria-hidden>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20.3 7.7l-1.4-1.4z"/>
                    </svg>
                  </span>
                  <span className={styles.btnLabel}>Accept</span>
                </button>
                <button 
                  className={styles.toggleButton}
                  onClick={onRejectAI}
                  aria-label="Revert changes"
                  title="Revert changes"
                >
                  <span className={styles.btnIcon} aria-hidden>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v4H6l6 6v-4h1a5 5 0 1 1 0 10h-1v-2h1a3 3 0 1 0 0-6h-1V9l-4 4-4-4h8V5h2z"/>
                    </svg>
                  </span>
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
                <span className={styles.btnIcon} aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4zm12 4l1.5 3 3 1.5-3 1.5L17 16l-1.5-3-3-1.5 3-1.5L17 7zM12 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/>
                  </svg>
                </span>
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
