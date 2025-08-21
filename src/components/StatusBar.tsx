import React, { useEffect, useState } from 'react';
import styles from '../styles/StatusBar.module.css';

interface StatusBarProps {
  content: string;
  fileName: string | null;
}

export function StatusBar({ content, fileName }: StatusBarProps) {
  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
  const charCount = content.length;
  const charCountNoSpaces = content.replace(/\s/g, '').length;
  const lineCount = content === '' ? 0 : content.split('\n').length;
  const [aiCost, setAiCost] = useState<number | null>(null);

  const fetchCost = async (path: string) => {
    try {
      const res = await fetch(`/api/ai/cost?path=${encodeURIComponent(path)}`, { credentials: 'same-origin' });
      const data = await res.json().catch(() => null);
      if (data && typeof data.totalCostUsd === 'number') setAiCost(data.totalCostUsd);
      else setAiCost(null);
    } catch {
      setAiCost(null);
    }
  };

  useEffect(() => {
    if (fileName) fetchCost(fileName);
    else setAiCost(null);
  }, [fileName]);

  useEffect(() => {
    const handler = (e: Event) => {
      const anyE = e as CustomEvent;
      const p = anyE.detail?.path as string | undefined;
      if (p && fileName && p === fileName) fetchCost(fileName);
    };
    window.addEventListener('ai-cost-updated', handler as EventListener);
    return () => window.removeEventListener('ai-cost-updated', handler as EventListener);
  }, [fileName]);

  return (
    <div className={styles.statusBar}>
      <div className={styles.left}>
        {fileName && <span className={styles.fileName}>{fileName}</span>}
        {fileName && aiCost !== null && (
          <span className={styles.stat} style={{ marginLeft: 12 }}>AI Cost: ${aiCost.toFixed(2)}</span>
        )}
      </div>
      <div className={styles.right}>
        <span className={styles.stat}>Lines: {lineCount}</span>
        <span className={styles.stat}>Words: {wordCount}</span>
        <span className={styles.stat}>Characters: {charCount} ({charCountNoSpaces} no spaces)</span>
      </div>
    </div>
  );
}
