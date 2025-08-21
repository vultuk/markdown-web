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
  defaultModel?: string;
  // Scroll sync
  onScrollRatio?: (ratio: number) => void;
  registerSetScroll?: (fn: (ratio: number) => void) => void;
  enableScrollSync?: boolean;
  // AI apply callback
  onAiApply?: (newContent: string) => void;
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
  defaultModel,
  onScrollRatio,
  registerSetScroll,
  enableScrollSync = false,
  onAiApply,
}: EditorProps) {
  const [aiEnabled, setAiEnabled] = useState<boolean>(false);
  const [aiOpen, setAiOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [prevContent, setPrevContent] = useState<string | null>(null);
  const [model, setModel] = useState<string>(defaultModel || 'gpt-5-mini');

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

  // Listen for header AI open requests
  useEffect(() => {
    const handler = () => { setModel(defaultModel || 'gpt-5-mini'); setAiOpen(true); };
    window.addEventListener('open-ai-modal', handler as EventListener);
    return () => window.removeEventListener('open-ai-modal', handler as EventListener);
  }, []);

  // Scroll sync support
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const programmaticScrollRef = React.useRef(false);
  React.useEffect(() => {
    if (!registerSetScroll) return;
    const setter = (ratio: number) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const max = ta.scrollHeight - ta.clientHeight;
      programmaticScrollRef.current = true;
      ta.scrollTop = Math.max(0, Math.min(max, ratio * max));
      requestAnimationFrame(() => { programmaticScrollRef.current = false; });
    };
    registerSetScroll(setter);
  }, [registerSetScroll]);

  const onEditorScroll = () => {
    if (!enableScrollSync || !onScrollRatio) return;
    if (programmaticScrollRef.current) return;
    const ta = textareaRef.current;
    if (!ta) return;
    const max = ta.scrollHeight - ta.clientHeight;
    const ratio = max > 0 ? ta.scrollTop / max : 0;
    onScrollRatio(ratio);
  };

  return (
    <div className={styles.editor}>
      {/* AI open button moved to Header */}
      <div className={styles.content}>
        {!fileName ? (
          <div className={styles.placeholder}>
            <h2>Welcome to Markdown Web Editor</h2>
            <p>Select a file from the sidebar to start editing, or create a new one.</p>
          </div>
        ) : (
          <textarea
            className={styles.textarea}
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start typing your markdown..."
            spellCheck={false}
            onScroll={onEditorScroll}
          />
        )}
      </div>
      {aiEnabled && aiOpen && (
        <div className={styles.aiModal} role="dialog" aria-modal="true" aria-label="AI prompt">
          <div className={styles.aiModalInner}>
            <div className={styles.aiHeader}>✨ AI Assistant</div>
            <div className={styles.aiBody}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <label htmlFor="ai-model" style={{ color: '#bbb', fontSize: 12 }}>Model</label>
                <select id="ai-model" value={model} onChange={(e) => setModel(e.currentTarget.value)} disabled={aiLoading} style={{ background: '#1e1e1e', color: '#e6e6e6', border: '1px solid #3e3e42', borderRadius: 6, padding: '6px 8px' }}>
                  <option value="gpt-5">gpt-5</option>
                  <option value="gpt-5-mini">gpt-5-mini</option>
                  <option value="gpt-5-nano">gpt-5-nano</option>
                </select>
              </div>
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
                      body: JSON.stringify({ prompt: p, content, path: fileName || '', model }),
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
                    if (onAiApply) onAiApply(data.content); else onChange(data.content);
                    try { window.dispatchEvent(new CustomEvent('ai-cost-updated', { detail: { path: fileName || '' } })); } catch {}
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
      {/* Accept/Reject controls moved to Header */}
      <StatusBar content={content} fileName={fileName} />
    </div>
  );
}
