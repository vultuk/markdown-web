import React from 'react';
import styles from '../styles/SaveIndicator.module.css';

interface SaveIndicatorProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export function SaveIndicator({ isSaving, hasUnsavedChanges }: SaveIndicatorProps) {
  if (isSaving) {
    return (
      <div className={styles.indicator}>
        <div className={styles.spinner}></div>
        <span>Saving...</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className={styles.indicator}>
        <span>Unsaved changes</span>
      </div>
    );
  }

  return (
    <div className={styles.indicator}>
      <span>Saved</span>
    </div>
  );
}