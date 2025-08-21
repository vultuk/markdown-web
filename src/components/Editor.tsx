import React, { useEffect, useState } from 'react';
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
  const [aiEnabled, setAiEnabled] = useState<boolean>(false);
  const [aiOpen, setAiOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [prevContent, setPrevContent] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/ai/status', { credentials: 'same-origin' });
        const data = await res.json().catch(() => ({}));
        if (mounted) setAiEnabled(!!data.enabled);
      } catch {
        if (mounted) setAiEnabled(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
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
      {aiEnabled && (
        <button
          type="button"
          className={styles.aiButton}
          title="Open AI prompt"
          onClick={() => setAiOpen((v) => !v)}
          aria-label="Open AI prompt"
        >
          🤖
        </button>
      )}
      <div className={styles.content}>
        {!fileName ? (
          <div className={styles.placeholder}>
            <h2>Welcome to Markdown Web Editor</h2>
            <p>Select a file from the sidebar to start editing, or create a new one.</p>
          </div>
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
      {aiEnabled && aiOpen && (
        <div className={styles.aiModal} role="dialog" aria-modal="true" aria-label="AI prompt">
          <div className={styles.aiModalInner}>
            <textarea
              className={styles.aiTextarea}
              placeholder="Ask AI…"
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
            />
            <div className={styles.aiActions}>
              <button
                className={styles.aiClose}
                onClick={async () => {
                  if (!fileName) { setAiOpen(false); return; }
                  const p = prompt.trim();
                  if (!p) { setAiOpen(false); return; }
                  try {
                    setAiLoading(true);
                    const res = await fetch('/api/ai/apply', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'same-origin',
                      body: JSON.stringify({ prompt: p, content }),
                    });
                    if (!res.ok) {
                      alert('AI request failed');
                      return;
                    }
                    const data = await res.json();
                    if (!data || typeof data.content !== 'string') {
                      alert('Invalid AI response');
                      return;
                    }
                    setPrevContent(content);
                    onChange(data.content);
                    setAiOpen(false);
                    setPrompt('');
                  } catch (e) {
                    alert('AI request failed');
                  } finally {
                    setAiLoading(false);
                  }
                }}
                disabled={aiLoading}
              >
                {aiLoading ? 'Applying…' : 'Apply'}
              </button>
              <button className={styles.aiClose} onClick={() => setAiOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {prevContent !== null && (
        <button
          className={styles.revertButton}
          onClick={() => {
            onChange(prevContent);
            setPrevContent(null);
          }}
          title="Revert AI changes"
        >
          Revert
        </button>
      )}
      <StatusBar content={content} fileName={fileName} />
    </div>
  );
}
