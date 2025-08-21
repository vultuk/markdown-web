import React, { useEffect, useState } from 'react';
import { StatusBar } from './StatusBar';
import styles from '../styles/Editor.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  onAiApply,
}: EditorProps) {
  const [aiEnabled, setAiEnabled] = useState<boolean>(false);
  const [aiOpen, setAiOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [prevContent, setPrevContent] = useState<string | null>(null);
  const [model, setModel] = useState<string>(defaultModel || 'gpt-5-mini');
  const [mode, setMode] = useState<'adjust' | 'ask'>('adjust');
  const [answer, setAnswer] = useState<string | null>(null);

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
    const handler = () => {
      setModel(defaultModel || 'gpt-5-mini');
      setMode('adjust');
      setAnswer(null);
      setAiOpen(true);
    };
    window.addEventListener('open-ai-modal', handler as EventListener);
    return () => window.removeEventListener('open-ai-modal', handler as EventListener);
  }, []);

  // Scroll sync removed (reverted)

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
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div className={styles.aiModeToggle} role="tablist" aria-label="AI mode">
                  <button
                    role="tab"
                    aria-selected={mode === 'adjust'}
                    className={`${styles.aiToggleButton} ${mode === 'adjust' ? styles.aiToggleActive : ''}`}
                    onClick={() => setMode('adjust')}
                    disabled={aiLoading}
                    title="Apply changes to the markdown"
                  >
                    Adjust
                  </button>
                  <button
                    role="tab"
                    aria-selected={mode === 'ask'}
                    className={`${styles.aiToggleButton} ${mode === 'ask' ? styles.aiToggleActive : ''}`}
                    onClick={() => setMode('ask')}
                    disabled={aiLoading}
                    title="Ask a question about this markdown"
                  >
                    Ask
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <label htmlFor="ai-model" style={{ color: '#bbb', fontSize: 12 }}>Model</label>
                  <select id="ai-model" value={model} onChange={(e) => setModel(e.currentTarget.value)} disabled={aiLoading} style={{ background: '#1e1e1e', color: '#e6e6e6', border: '1px solid #3e3e42', borderRadius: 6, padding: '6px 8px' }}>
                    <option value="gpt-5">gpt-5</option>
                    <option value="gpt-5-mini">gpt-5-mini</option>
                    <option value="gpt-5-nano">gpt-5-nano</option>
                  </select>
                </div>
              </div>
              <textarea
                className={styles.aiTextarea}
                placeholder={mode === 'adjust' ? 'Describe the changes you want to apply to this markdown…' : 'Ask a question about this markdown…'}
                value={prompt}
                onChange={(e) => setPrompt(e.currentTarget.value)}
                disabled={aiLoading}
              />
              {mode === 'ask' && answer && (
                <div className={styles.aiAnswer} aria-live="polite">
                  <div className={styles.aiAnswerHeader}>
                    <span>Answer</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className={styles.aiAnswerAction}
                        onClick={async () => { try { await navigator.clipboard.writeText(answer); } catch {} }}
                        title="Copy answer"
                      >Copy</button>
                      <button
                        className={styles.aiAnswerAction}
                        onClick={() => setAnswer(null)}
                        title="Clear answer"
                      >Clear</button>
                    </div>
                  </div>
                  <div className={styles.aiAnswerContent}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
                  </div>
                </div>
              )}
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
                    if (mode === 'adjust') {
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
                    } else {
                      const res = await fetch('/api/ai/ask', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'same-origin',
                        body: JSON.stringify({ prompt: p, content, model }),
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
                      if (!data || typeof data.answer !== 'string') {
                        alert('Invalid AI response');
                        return;
                      }
                      setAnswer(data.answer);
                    }
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
                    {mode === 'adjust' ? 'Applying…' : 'Asking…'}
                  </span>
                ) : (mode === 'adjust' ? 'Apply' : 'Ask')}
              </button>
              <button className={styles.aiButtonSecondary} onClick={() => { setAiOpen(false); setAnswer(null); }} disabled={aiLoading}>Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Accept/Reject controls moved to Header */}
      <StatusBar content={content} fileName={fileName} />
    </div>
  );
}
