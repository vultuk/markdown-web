import React, { useEffect } from 'react';
import styles from '../styles/ConfirmationModal.module.css';
import { useTheme } from '../hooks/useTheme';

export type PreviewLayout = 'full' | 'split';
export type SidebarMode = 'overlay' | 'inline';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewLayout: PreviewLayout;
  onChangePreviewLayout: (layout: PreviewLayout) => void;
  sidebarMode: SidebarMode;
  onChangeSidebarMode: (mode: SidebarMode) => void;
}

export function SettingsModal({ isOpen, onClose, previewLayout, onChangePreviewLayout, sidebarMode, onChangeSidebarMode }: SettingsModalProps) {
  const { availableThemes, selectedTheme, loading, changeTheme } = useTheme();
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
          <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: 16 }}>
            <legend style={{ color: '#bbb', marginBottom: 8, fontSize: 13 }}>Sidebar behavior (desktop)</legend>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="sidebarMode"
                value="overlay"
                checked={sidebarMode === 'overlay'}
                onChange={() => onChangeSidebarMode('overlay')}
              />
              <span>Overlay (recommended)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="sidebarMode"
                value="inline"
                checked={sidebarMode === 'inline'}
                onChange={() => onChangeSidebarMode('inline')}
              />
              <span>Inline (resizes content)</span>
            </label>
            <div style={{ color: '#888', fontSize: 12, marginTop: 6 }}>Mobile always uses overlay.</div>
          </fieldset>

          <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: 16 }}>
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

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend style={{ color: '#bbb', marginBottom: 8, fontSize: 13 }}>Theme</legend>
            {loading || availableThemes.length === 0 ? (
              <div style={{ color: '#999', fontSize: 13 }}>Loading themes…</div>
            ) : (
              <select
                value={selectedTheme}
                onChange={(e) => changeTheme(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 4,
                  border: '1px solid #3e3e42',
                  background: '#1e1e1e',
                  color: '#ddd'
                }}
              >
                {availableThemes.map((t) => (
                  <option key={t.name} value={t.name}>{t.displayName}</option>
                ))}
              </select>
            )}
          </fieldset>
        </div>
        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
