import React, { useEffect } from 'react';
import { MarkdownPreview } from './MarkdownPreview';
import { StatusBar } from './StatusBar';
import styles from '../styles/Editor.module.css';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  isPreviewMode: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onManualSave: () => Promise<void>;
  fileName: string | null;
}

export function Editor({ 
  content, 
  onChange, 
  isPreviewMode, 
  isSaving, 
  hasUnsavedChanges,
  onManualSave,
  fileName 
}: EditorProps) {
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        try {
          await onManualSave();
        } catch (error) {
          // Error is already logged in useAutoSave hook
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onManualSave]);

  return (
    <div className={styles.editor}>
      <div className={styles.content}>
        {!fileName ? (
          <div className={styles.placeholder}>
            <h2>Welcome to Markdown Web Editor</h2>
            <p>Select a file from the sidebar to start editing, or create a new one.</p>
          </div>
        ) : isPreviewMode ? (
          <MarkdownPreview content={content} />
        ) : (
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start typing your markdown..."
            spellCheck={false}
          />
        )}
      </div>

      <StatusBar content={content} fileName={fileName} />
    </div>
  );
}