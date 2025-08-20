import React from 'react';
import { useTheme } from '../hooks/useTheme';
import styles from '../styles/ThemeSelector.module.css';

export function ThemeSelector() {
  const { availableThemes, selectedTheme, loading, changeTheme } = useTheme();

  if (loading || availableThemes.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <select
        className={styles.select}
        value={selectedTheme}
        onChange={(e) => changeTheme(e.target.value)}
        title="Select preview theme"
      >
        {availableThemes.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}