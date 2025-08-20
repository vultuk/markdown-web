import React from 'react';
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

  return (
    <div className={styles.statusBar}>
      <div className={styles.left}>
        {fileName && <span className={styles.fileName}>{fileName}</span>}
      </div>
      <div className={styles.right}>
        <span className={styles.stat}>Lines: {lineCount}</span>
        <span className={styles.stat}>Words: {wordCount}</span>
        <span className={styles.stat}>Characters: {charCount} ({charCountNoSpaces} no spaces)</span>
      </div>
    </div>
  );
}