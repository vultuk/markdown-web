import React, { useEffect } from 'react';
import styles from '../styles/ConfirmationModal.module.css';

export type PreviewLayout = 'full' | 'split';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewLayout: PreviewLayout;
  onChangePreviewLayout: (layout: PreviewLayout) => void;
}

export function SettingsModal({ isOpen, onClose, previewLayout, onChangePreviewLayout }: SettingsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Settings</h3>
        </div>
        <div className={styles.body}>
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend style={{ color: '#bbb', marginBottom: 8, fontSize: 13 }}>Preview layout</legend>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="previewLayout"
                value="full"
                checked={previewLayout === 'full'}
                onChange={() => onChangePreviewLayout('full')}
              />
              <span>Full area</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="previewLayout"
                value="split"
                checked={previewLayout === 'split'}
                onChange={() => onChangePreviewLayout('split')}
              />
              <span>Resizable split</span>
            </label>
          </fieldset>
        </div>
        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

