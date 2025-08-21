import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Theme {
  name: string;
  displayName: string;
  preview: {
    background: string;
    color: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    padding: string;
    h1: Record<string, string>;
    h2: Record<string, string>;
    h3: Record<string, string>;
    p: Record<string, string>;
    code: Record<string, string>;
    pre: Record<string, string>;
    blockquote: Record<string, string>;
    table: Record<string, string>;
    th: Record<string, string>;
    td: Record<string, string>;
    a: Record<string, string>;
    ul: Record<string, string>;
    ol: Record<string, string>;
    li: Record<string, string>;
  };
  print: {
    background: string;
    color: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    h1: Record<string, string>;
    h2: Record<string, string>;
    h3: Record<string, string>;
    p: Record<string, string>;
    code: Record<string, string>;
    pre: Record<string, string>;
    blockquote: Record<string, string>;
    table: Record<string, string>;
    th: Record<string, string>;
    td: Record<string, string>;
    ul: Record<string, string>;
    ol: Record<string, string>;
    li: Record<string, string>;
  };
}

interface ThemeOption {
  name: string;
  displayName: string;
}

interface ThemeContextType {
  availableThemes: ThemeOption[];
  selectedTheme: string;
  currentTheme: Theme | null;
  loading: boolean;
  changeTheme: (themeName: string) => Promise<void>;
  generateCSS: (theme: Theme, isPrint?: boolean) => {
    container: string;
    elements: Record<string, string>;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [availableThemes, setAvailableThemes] = useState<ThemeOption[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('dark');
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  // Load available themes
  useEffect(() => {
    const loadThemes = async () => {
      try {
        const response = await fetch('/api/themes', { credentials: 'same-origin' });
        if (response.ok) {
          const themeNames = await response.json();
          
          // Get display names for themes
          const themes: ThemeOption[] = [];
          for (const name of themeNames) {
            try {
              const themeResponse = await fetch(`/api/themes/${name}`, { credentials: 'same-origin' });
              if (themeResponse.ok) {
                const theme = await themeResponse.json();
                themes.push({
                  name: theme.name,
                  displayName: theme.displayName
                });
              }
            } catch (error) {
              console.error(`Failed to load theme ${name}:`, error);
            }
          }
          
          setAvailableThemes(themes);
        }
      } catch (error) {
        console.error('Failed to load themes:', error);
      }
    };

    loadThemes();
  }, []);

  // Load current settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings', { credentials: 'same-origin' });
        if (response.ok) {
          const settings = await response.json();
          setSelectedTheme(settings.selectedTheme);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Load current theme data when selectedTheme changes
  useEffect(() => {
    const loadTheme = async () => {
      if (!selectedTheme) return;
      
      try {
        const response = await fetch(`/api/themes/${selectedTheme}`, { credentials: 'same-origin' });
        if (response.ok) {
          const theme = await response.json();
          setCurrentTheme(theme);
        }
      } catch (error) {
        console.error(`Failed to load theme ${selectedTheme}:`, error);
      }
    };

    loadTheme();
  }, [selectedTheme]);

  const changeTheme = useCallback(async (themeName: string) => {
    // Only update local state; persistence is handled by the caller (Settings modal)
    try {
      setSelectedTheme(themeName);
    } catch (error) {
      console.error('Failed to change theme:', error);
    }
  }, []);

  const generateCSS = useCallback((theme: Theme, isPrint: boolean = false) => {
    const styles = isPrint ? theme.print : theme.preview;
    
    let css = '';
    
    if (!isPrint) {
      // Base container styles for preview
      css += `
        background: ${styles.background} !important;
        color: ${styles.color} !important;
        font-family: ${styles.fontFamily} !important;
        font-size: ${styles.fontSize} !important;
        line-height: ${styles.lineHeight} !important;
        padding: ${styles.padding} !important;
      `;
    } else {
      // Base container styles for print
      // Use theme-provided background and color, defaulting to white/black
      const bg = (styles as any).background || '#ffffff';
      const fg = (styles as any).color || '#000000';
      css += `
        background: ${bg} !important;
        color: ${fg} !important;
        font-family: ${styles.fontFamily} !important;
        font-size: ${styles.fontSize} !important;
        line-height: ${styles.lineHeight} !important;
      `;
    }

    // Generate styles for each element type
    const elements = ['h1', 'h2', 'h3', 'p', 'code', 'pre', 'blockquote', 'table', 'th', 'td', 'a', 'ul', 'ol', 'li'];
    
    return {
      container: css.trim(),
      elements: elements.reduce((acc, element) => {
        const elementStyles = styles[element as keyof typeof styles];
        if (elementStyles && typeof elementStyles === 'object') {
          acc[element] = Object.entries(elementStyles)
            .map(([prop, value]) => `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value} !important`)
            .join('; ');
        }
        return acc;
      }, {} as Record<string, string>)
    };
  }, []);

  const value: ThemeContextType = {
    availableThemes,
    selectedTheme,
    currentTheme,
    loading,
    changeTheme,
    generateCSS
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
