import React, { useEffect } from 'react';
import styles from '../styles/Toast.module.css';

interface ToastProps {
  message: string;
  type?: 'info' | 'error' | 'success';
  duration?: number; // ms
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onClose} aria-label="Close notification">×</button>
    </div>
  );
}

