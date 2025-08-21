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
  onAiPendingChange?: (pending: boolean) => void;
}

export function Editor({ 
  content, 
  onChange, 
  isPreviewMode, 
  isSaving, 
  hasUnsavedChanges,
  onManualSave,
  fileName,
  onAiPendingChange,
}: EditorProps) {
  const [aiEnabled, setAiEnabled] = useState<boolean>(false);
  const [aiOpen, setAiOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [prevContent, setPrevContent] = useState<string | null>(null);
  const [lastCost, setLastCost] = useState<number | null>(null);
  const [lastTokens, setLastTokens] = useState<{ inputTokens: number; outputTokens: number; totalTokens: number } | null>(null);

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
          ✨
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
            <div className={styles.aiHeader}>✨ AI Assistant</div>
            <div className={styles.aiBody}>
              <textarea
                className={styles.aiTextarea}
                placeholder="Describe the changes you want to apply to this markdown…"
                value={prompt}
                onChange={(e) => setPrompt(e.currentTarget.value)}
                disabled={aiLoading}
              />
            </div>
            <div className={styles.aiActions}>
              <button
                className={`${styles.aiButtonPrimary}`}
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
                      body: JSON.stringify({ prompt: p, content, path: fileName || '' }),
                    });
                    if (!res.ok) {
                      let msg = 'AI request failed';
                      try {
                        const err = await res.json();
                        if (err && (err.error || err.details)) {
                          msg = `${err.error || 'AI error'}: ${err.details || ''}`;
                        }
                      } catch {}
                      alert(msg);
                      return;
                    }
                    const data = await res.json();
                    if (!data || typeof data.content !== 'string') {
                      alert('Invalid AI response');
                      return;
                    }
                    setPrevContent(content);
                    onAiPendingChange?.(true);
                    onChange(data.content);
                    if (typeof data.costUsd === 'number') setLastCost(data.costUsd);
                    if (data.usage && typeof data.usage.totalTokens === 'number') setLastTokens(data.usage);
                    // Notify cost updated for this file
                    try { window.dispatchEvent(new CustomEvent('ai-cost-updated', { detail: { path: fileName || '' } })); } catch {}
                    // keep modal open to show cost
                    setPrompt('');
                  } catch (e) {
                    alert('AI request failed');
                  } finally {
                    setAiLoading(false);
                  }
                }}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <span className={styles.spinnerWrap}>
                    <span className={styles.spinner} aria-hidden />
                    Applying…
                  </span>
                ) : 'Apply'}
              </button>
              <button className={styles.aiButtonSecondary} onClick={() => setAiOpen(false)} disabled={aiLoading}>Close</button>
            </div>
          </div>
        </div>
      )}
      {aiEnabled && aiOpen && lastTokens && (
        <div className={styles.aiCostBadge} title={`Input: ${lastTokens.inputTokens}, Output: ${lastTokens.outputTokens}, Total: ${lastTokens.totalTokens}`}>
          {lastCost !== null ? `$${lastCost.toFixed(4)}` : `${lastTokens.totalTokens} tok`}
        </div>
      )}
      {prevContent !== null && (
        <button
          className={styles.revertButton}
          onClick={() => {
            onChange(prevContent);
            setPrevContent(null);
            onAiPendingChange?.(false);
          }}
          title="Revert AI changes"
        >
          Revert
        </button>
      )}
      {prevContent !== null && (
        <button
          className={styles.acceptButton}
          onClick={async () => {
            try {
              await onManualSave();
            } catch {}
            setPrevContent(null);
            onAiPendingChange?.(false);
          }}
          title="Accept AI changes"
        >
          Accept
        </button>
      )}
      <StatusBar content={content} fileName={fileName} />
    </div>
  );
}
