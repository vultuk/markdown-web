import fs from 'fs/promises';
import path from 'path';
import os from 'os';

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

export interface Settings {
  selectedTheme: string;
  previewLayout?: 'full' | 'split';
  sidebarMode?: 'overlay' | 'inline';
  openAiModel?: string;
  scrollSync?: boolean;
  mermaidEnabled?: boolean;
}

export class ThemeManager {
  private themesDir: string;
  private settingsFile: string;

  constructor() {
    const homeDir = os.homedir();
    const configDir = path.join(homeDir, '.markdown-web');
    this.themesDir = path.join(configDir, 'themes');
    this.settingsFile = path.join(configDir, 'settings.json');
  }

  async initialize(): Promise<void> {
    try {
      // Create themes directory if it doesn't exist
      await fs.mkdir(this.themesDir, { recursive: true });
      
      // Copy default themes if they don't exist
      await this.ensureDefaultThemes();
      
      // Create default settings if they don't exist
      await this.ensureDefaultSettings();
    } catch (error) {
      console.error('Failed to initialize themes:', error);
    }
  }

  async getThemes(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.themesDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      console.error('Failed to read themes:', error);
      return [];
    }
  }

  async getTheme(name: string): Promise<Theme | null> {
    try {
      const themePath = path.join(this.themesDir, `${name}.json`);
      const themeData = await fs.readFile(themePath, 'utf-8');
      return JSON.parse(themeData);
    } catch (error) {
      console.error(`Failed to read theme ${name}:`, error);
      return null;
    }
  }

  async saveTheme(theme: Theme): Promise<void> {
    try {
      const themePath = path.join(this.themesDir, `${theme.name}.json`);
      await fs.writeFile(themePath, JSON.stringify(theme, null, 2));
    } catch (error) {
      console.error(`Failed to save theme ${theme.name}:`, error);
      throw error;
    }
  }

  async getSettings(): Promise<Settings> {
    try {
      const settingsData = await fs.readFile(this.settingsFile, 'utf-8');
      const parsed = JSON.parse(settingsData);
      // Fill defaults for any missing keys to keep behavior consistent
      const defaults: Settings = { selectedTheme: 'dark', previewLayout: 'full', sidebarMode: 'overlay', openAiModel: 'gpt-5-mini', scrollSync: false, mermaidEnabled: false };
      return { ...defaults, ...parsed };
    } catch (error) {
      // Return default settings if file doesn't exist
      return { selectedTheme: 'dark', previewLayout: 'full', sidebarMode: 'overlay', openAiModel: 'gpt-5-mini', scrollSync: false, mermaidEnabled: false };
    }
  }

  async saveSettings(settings: Settings): Promise<void> {
    try {
      await fs.writeFile(this.settingsFile, JSON.stringify(settings, null, 2));
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  private async ensureDefaultThemes(): Promise<void> {
    const defaultThemes = this.getDefaultThemes();
    
    for (const theme of defaultThemes) {
      const themePath = path.join(this.themesDir, `${theme.name}.json`);
      
      try {
        await fs.access(themePath);
      } catch {
        // File doesn't exist, create it
        await fs.writeFile(themePath, JSON.stringify(theme, null, 2));
      }
    }
  }

  private async ensureDefaultSettings(): Promise<void> {
    try {
      await fs.access(this.settingsFile);
    } catch {
      // File doesn't exist, create it
      const defaultSettings: Settings = { selectedTheme: 'dark', previewLayout: 'full', sidebarMode: 'overlay', openAiModel: 'gpt-5-mini', scrollSync: false, mermaidEnabled: false };
      await fs.writeFile(this.settingsFile, JSON.stringify(defaultSettings, null, 2));
    }
  }

  private getDefaultThemes(): Theme[] {
    return [
      {
        name: 'dark',
        displayName: 'Dark (Default)',
        preview: {
          background: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          padding: '16px 24px',
          h1: {
            color: '#ffffff',
            fontSize: '2em',
            borderBottom: '1px solid #3e3e42',
            paddingBottom: '8px',
            marginTop: '24px',
            marginBottom: '16px'
          },
          h2: {
            color: '#ffffff',
            fontSize: '1.5em',
            borderBottom: '1px solid #3e3e42',
            paddingBottom: '4px',
            marginTop: '24px',
            marginBottom: '16px'
          },
          h3: {
            color: '#ffffff',
            fontSize: '1.3em',
            marginTop: '24px',
            marginBottom: '16px'
          },
          p: {
            marginBottom: '16px'
          },
          code: {
            backgroundColor: '#2d2d30',
            color: '#f92672',
            padding: '2px 4px',
            borderRadius: '3px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
          },
          pre: {
            backgroundColor: '#2d2d30',
            border: '1px solid #3e3e42',
            borderRadius: '6px',
            padding: '16px',
            overflowX: 'auto',
            marginBottom: '16px'
          },
          blockquote: {
            borderLeft: '4px solid #3e3e42',
            paddingLeft: '16px',
            margin: '16px 0',
            color: '#888',
            fontStyle: 'italic'
          },
          table: {
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '16px'
          },
          th: {
            border: '1px solid #3e3e42',
            padding: '8px 12px',
            textAlign: 'left',
            backgroundColor: '#2d2d30',
            fontWeight: '600'
          },
          td: {
            border: '1px solid #3e3e42',
            padding: '8px 12px',
            textAlign: 'left'
          },
          a: {
            color: '#569cd6',
            textDecoration: 'none'
          },
          ul: {
            marginLeft: '24px',
            marginBottom: '16px'
          },
          ol: {
            marginLeft: '24px',
            marginBottom: '16px'
          },
          li: {
            marginBottom: '4px'
          }
        },
        print: {
          background: '#ffffff',
          color: '#000000',
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: '12pt',
          lineHeight: '1.6',
          h1: {
            fontSize: '18pt',
            borderBottom: '2pt solid #000',
            paddingBottom: '5pt',
            marginTop: '20pt',
            marginBottom: '10pt',
            pageBreakAfter: 'avoid'
          },
          h2: {
            fontSize: '16pt',
            borderBottom: '1pt solid #666',
            paddingBottom: '3pt',
            marginTop: '20pt',
            marginBottom: '10pt',
            pageBreakAfter: 'avoid'
          },
          h3: {
            fontSize: '14pt',
            marginTop: '20pt',
            marginBottom: '10pt',
            pageBreakAfter: 'avoid'
          },
          p: {
            margin: '8pt 0'
          },
          code: {
            background: '#f0f0f0',
            padding: '1pt 3pt',
            fontFamily: '"Courier New", monospace',
            fontSize: '10pt',
            border: 'none'
          },
          pre: {
            background: '#f8f8f8',
            border: '1pt solid #ddd',
            padding: '8pt',
            fontFamily: '"Courier New", monospace',
            fontSize: '10pt',
            overflow: 'visible',
            pageBreakInside: 'avoid',
            margin: '8pt 0',
            whiteSpace: 'pre-wrap'
          },
          blockquote: {
            borderLeft: '3pt solid #666',
            paddingLeft: '12pt',
            margin: '8pt 0',
            fontStyle: 'italic',
            color: '#333'
          },
          table: {
            borderCollapse: 'collapse',
            width: '100%',
            margin: '8pt 0',
            pageBreakInside: 'avoid'
          },
          th: {
            border: '1pt solid #666',
            padding: '4pt 8pt',
            textAlign: 'left',
            background: '#f0f0f0',
            fontWeight: 'bold'
          },
          td: {
            border: '1pt solid #666',
            padding: '4pt 8pt',
            textAlign: 'left'
          },
          ul: {
            margin: '8pt 0',
            paddingLeft: '20pt'
          },
          ol: {
            margin: '8pt 0',
            paddingLeft: '20pt'
          },
          li: {
            margin: '4pt 0'
          }
        }
      },
      {
        name: 'github',
        displayName: 'GitHub',
        preview: {
          background: '#ffffff',
          color: '#24292f',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.5',
          padding: '16px 24px',
          h1: {
            color: '#24292f',
            fontSize: '2em',
            fontWeight: '600',
            paddingBottom: '0.3em',
            borderBottom: '1px solid #d0d7de',
            marginTop: '24px',
            marginBottom: '16px'
          },
          h2: {
            color: '#24292f',
            fontSize: '1.5em',
            fontWeight: '600',
            paddingBottom: '0.3em',
            borderBottom: '1px solid #d0d7de',
            marginTop: '24px',
            marginBottom: '16px'
          },
          h3: {
            color: '#24292f',
            fontSize: '1.25em',
            fontWeight: '600',
            marginTop: '24px',
            marginBottom: '16px'
          },
          p: {
            marginBottom: '16px'
          },
          code: {
            backgroundColor: 'rgba(175,184,193,0.2)',
            color: '#24292f',
            padding: '0.2em 0.4em',
            borderRadius: '6px',
            fontSize: '85%',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          },
          pre: {
            backgroundColor: '#f6f8fa',
            border: '1px solid #d0d7de',
            borderRadius: '6px',
            padding: '16px',
            overflow: 'auto',
            fontSize: '85%',
            lineHeight: '1.45',
            marginBottom: '16px'
          },
          blockquote: {
            borderLeft: '0.25em solid #d0d7de',
            paddingLeft: '1em',
            color: '#656d76',
            margin: '0 0 16px 0'
          },
          table: {
            borderCollapse: 'collapse',
            borderSpacing: '0',
            width: '100%',
            marginTop: '0',
            marginBottom: '16px'
          },
          th: {
            border: '1px solid #d0d7de',
            padding: '6px 13px',
            fontWeight: '600',
            backgroundColor: '#f6f8fa'
          },
          td: {
            border: '1px solid #d0d7de',
            padding: '6px 13px'
          },
          a: {
            color: '#0969da',
            textDecoration: 'none'
          },
          ul: {
            paddingLeft: '2em',
            marginTop: '0',
            marginBottom: '16px'
          },
          ol: {
            paddingLeft: '2em',
            marginTop: '0',
            marginBottom: '16px'
          },
          li: {
            wordWrap: 'break-all'
          }
        },
        print: {
          background: '#ffffff',
          color: '#24292f',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
          fontSize: '11pt',
          lineHeight: '1.5',
          h1: {
            fontSize: '20pt',
            fontWeight: '600',
            paddingBottom: '0.3em',
            borderBottom: '1pt solid #000',
            marginTop: '24pt',
            marginBottom: '16pt',
            pageBreakAfter: 'avoid'
          },
          h2: {
            fontSize: '16pt',
            fontWeight: '600',
            paddingBottom: '0.3em',
            borderBottom: '1pt solid #666',
            marginTop: '20pt',
            marginBottom: '12pt',
            pageBreakAfter: 'avoid'
          },
          h3: {
            fontSize: '14pt',
            fontWeight: '600',
            marginTop: '16pt',
            marginBottom: '8pt',
            pageBreakAfter: 'avoid'
          },
          p: {
            margin: '0 0 12pt 0'
          },
          code: {
            backgroundColor: '#f6f8fa',
            padding: '0.2em 0.4em',
            borderRadius: '3pt',
            fontSize: '85%',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          },
          pre: {
            backgroundColor: '#f6f8fa',
            border: '1pt solid #d0d7de',
            borderRadius: '3pt',
            padding: '12pt',
            fontSize: '85%',
            lineHeight: '1.45',
            marginBottom: '12pt',
            pageBreakInside: 'avoid',
            whiteSpace: 'pre-wrap'
          },
          blockquote: {
            borderLeft: '3pt solid #d0d7de',
            paddingLeft: '12pt',
            color: '#656d76',
            margin: '0 0 12pt 0'
          },
          table: {
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '12pt',
            pageBreakInside: 'avoid'
          },
          th: {
            border: '1pt solid #000',
            padding: '6pt 8pt',
            fontWeight: '600',
            backgroundColor: '#f6f8fa'
          },
          td: {
            border: '1pt solid #000',
            padding: '6pt 8pt'
          },
          ul: {
            paddingLeft: '20pt',
            marginBottom: '12pt'
          },
          ol: {
            paddingLeft: '20pt',
            marginBottom: '12pt'
          },
          li: {
            marginBottom: '2pt'
          }
        }
      },
      {
        name: 'academic',
        displayName: 'Academic',
        preview: {
          background: '#fefefe',
          color: '#2c2c2c',
          fontFamily: '"Crimson Text", "Times New Roman", Times, serif',
          fontSize: '18px',
          lineHeight: '1.7',
          padding: '32px 48px',
          h1: {
            color: '#1a1a1a',
            fontSize: '2.2em',
            fontWeight: '600',
            textAlign: 'center',
            marginTop: '32px',
            marginBottom: '24px',
            borderBottom: 'none'
          },
          h2: {
            color: '#1a1a1a',
            fontSize: '1.6em',
            fontWeight: '600',
            marginTop: '32px',
            marginBottom: '16px',
            borderBottom: 'none'
          },
          h3: {
            color: '#1a1a1a',
            fontSize: '1.3em',
            fontWeight: '600',
            marginTop: '24px',
            marginBottom: '12px'
          },
          p: {
            marginBottom: '20px',
            textAlign: 'justify',
            textIndent: '1.5em'
          },
          code: {
            backgroundColor: '#f8f8f8',
            color: '#d73a49',
            padding: '2px 6px',
            borderRadius: '3px',
            fontFamily: '"Fira Code", "Courier New", monospace',
            fontSize: '0.9em'
          },
          pre: {
            backgroundColor: '#f8f8f8',
            border: '1px solid #e1e4e8',
            borderRadius: '6px',
            padding: '20px',
            overflow: 'auto',
            marginBottom: '20px',
            fontSize: '0.9em'
          },
          blockquote: {
            borderLeft: '4px solid #d73a49',
            paddingLeft: '20px',
            margin: '20px 0',
            color: '#6a737d',
            fontStyle: 'italic',
            fontSize: '1.1em'
          },
          table: {
            borderCollapse: 'collapse',
            width: '100%',
            marginTop: '20px',
            marginBottom: '20px',
            fontSize: '0.95em'
          },
          th: {
            border: '2px solid #2c2c2c',
            padding: '12px 16px',
            textAlign: 'left',
            backgroundColor: '#f8f9fa',
            fontWeight: '600'
          },
          td: {
            border: '1px solid #6a737d',
            padding: '12px 16px',
            textAlign: 'left'
          },
          a: {
            color: '#d73a49',
            textDecoration: 'underline'
          },
          ul: {
            paddingLeft: '32px',
            marginBottom: '20px'
          },
          ol: {
            paddingLeft: '32px',
            marginBottom: '20px'
          },
          li: {
            marginBottom: '8px',
            lineHeight: '1.6'
          }
        },
        print: {
          background: '#ffffff',
          color: '#1a1a1a',
          fontFamily: '"Crimson Text", "Times New Roman", Times, serif',
          fontSize: '12pt',
          lineHeight: '1.7',
          h1: {
            fontSize: '18pt',
            fontWeight: '600',
            textAlign: 'center',
            marginTop: '0',
            marginBottom: '24pt',
            pageBreakAfter: 'avoid'
          },
          h2: {
            fontSize: '16pt',
            fontWeight: '600',
            marginTop: '24pt',
            marginBottom: '12pt',
            pageBreakAfter: 'avoid'
          },
          h3: {
            fontSize: '14pt',
            fontWeight: '600',
            marginTop: '18pt',
            marginBottom: '9pt',
            pageBreakAfter: 'avoid'
          },
          p: {
            marginBottom: '12pt',
            textAlign: 'justify',
            textIndent: '18pt'
          },
          code: {
            fontSize: '10pt',
            fontFamily: '"Courier New", monospace',
            backgroundColor: 'transparent',
            border: '1pt solid #ccc'
          },
          pre: {
            fontSize: '9pt',
            fontFamily: '"Courier New", monospace',
            border: '1pt solid #ccc',
            padding: '12pt',
            marginBottom: '12pt',
            pageBreakInside: 'avoid',
            whiteSpace: 'pre-wrap'
          },
          blockquote: {
            borderLeft: '3pt solid #666',
            paddingLeft: '18pt',
            margin: '12pt 0',
            fontStyle: 'italic',
            fontSize: '11pt'
          },
          table: {
            borderCollapse: 'collapse',
            width: '100%',
            marginTop: '12pt',
            marginBottom: '12pt',
            fontSize: '11pt',
            pageBreakInside: 'avoid'
          },
          th: {
            border: '2pt solid #000',
            padding: '8pt 12pt',
            textAlign: 'left',
            fontWeight: '600'
          },
          td: {
            border: '1pt solid #666',
            padding: '8pt 12pt',
            textAlign: 'left'
          },
          ul: {
            paddingLeft: '24pt',
            marginBottom: '12pt'
          },
          ol: {
            paddingLeft: '24pt',
            marginBottom: '12pt'
          },
          li: {
            marginBottom: '6pt',
            lineHeight: '1.6'
          }
        }
      },
      {
        name: 'minimal',
        displayName: 'Minimal',
        preview: {
          background: '#ffffff',
          color: '#333333',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          padding: '24px',
          h1: {
            color: '#1a1a1a',
            fontSize: '2.5em',
            fontWeight: '700',
            letterSpacing: '-0.025em',
            marginTop: '48px',
            marginBottom: '24px',
            borderBottom: 'none'
          },
          h2: {
            color: '#1a1a1a',
            fontSize: '1.875em',
            fontWeight: '600',
            letterSpacing: '-0.025em',
            marginTop: '40px',
            marginBottom: '20px',
            borderBottom: 'none'
          },
          h3: {
            color: '#1a1a1a',
            fontSize: '1.5em',
            fontWeight: '600',
            marginTop: '32px',
            marginBottom: '16px'
          },
          p: {
            marginBottom: '20px'
          },
          code: {
            backgroundColor: '#f7f7f7',
            color: '#e11d48',
            padding: '0.125rem 0.375rem',
            borderRadius: '0.375rem',
            fontFamily: '"Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace',
            fontSize: '0.875em'
          },
          pre: {
            backgroundColor: '#f7f7f7',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            overflow: 'auto',
            marginBottom: '20px',
            fontSize: '0.875em'
          },
          blockquote: {
            borderLeft: '4px solid #e5e7eb',
            paddingLeft: '1.5rem',
            margin: '20px 0',
            color: '#6b7280',
            fontSize: '1.125em'
          },
          table: {
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '20px'
          },
          th: {
            borderBottom: '2px solid #e5e7eb',
            padding: '12px 16px',
            textAlign: 'left',
            fontWeight: '600',
            color: '#374151'
          },
          td: {
            borderBottom: '1px solid #f3f4f6',
            padding: '12px 16px'
          },
          a: {
            color: '#2563eb',
            textDecoration: 'none',
            borderBottom: '1px solid transparent'
          },
          ul: {
            paddingLeft: '1.5rem',
            marginBottom: '20px'
          },
          ol: {
            paddingLeft: '1.5rem',
            marginBottom: '20px'
          },
          li: {
            marginBottom: '0.5rem'
          }
        },
        print: {
          background: '#ffffff',
          color: '#1a1a1a',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '11pt',
          lineHeight: '1.6',
          h1: {
            fontSize: '20pt',
            fontWeight: '700',
            letterSpacing: '-0.025em',
            marginTop: '0',
            marginBottom: '18pt',
            pageBreakAfter: 'avoid'
          },
          h2: {
            fontSize: '16pt',
            fontWeight: '600',
            letterSpacing: '-0.025em',
            marginTop: '24pt',
            marginBottom: '12pt',
            pageBreakAfter: 'avoid'
          },
          h3: {
            fontSize: '14pt',
            fontWeight: '600',
            marginTop: '18pt',
            marginBottom: '9pt',
            pageBreakAfter: 'avoid'
          },
          p: {
            marginBottom: '12pt'
          },
          code: {
            backgroundColor: '#f7f7f7',
            padding: '1pt 3pt',
            borderRadius: '2pt',
            fontFamily: '"SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace',
            fontSize: '9pt'
          },
          pre: {
            backgroundColor: '#f7f7f7',
            borderRadius: '3pt',
            padding: '12pt',
            fontSize: '9pt',
            marginBottom: '12pt',
            pageBreakInside: 'avoid',
            whiteSpace: 'pre-wrap'
          },
          blockquote: {
            borderLeft: '3pt solid #e5e7eb',
            paddingLeft: '12pt',
            margin: '12pt 0',
            color: '#6b7280',
            fontSize: '11pt'
          },
          table: {
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '12pt',
            pageBreakInside: 'avoid'
          },
          th: {
            borderBottom: '2pt solid #000',
            padding: '6pt 8pt',
            textAlign: 'left',
            fontWeight: '600'
          },
          td: {
            borderBottom: '1pt solid #ccc',
            padding: '6pt 8pt'
          },
          ul: {
            paddingLeft: '18pt',
            marginBottom: '12pt'
          },
          ol: {
            paddingLeft: '18pt',
            marginBottom: '12pt'
          },
          li: {
            marginBottom: '3pt'
          }
        }
      },
      {
        name: 'notion',
        displayName: 'Notion',
        preview: {
          background: '#ffffff',
          color: '#37352f',
          fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.5',
          padding: '96px 96px 30vh',
          h1: {
            color: '#37352f',
            fontSize: '40px',
            lineHeight: '1.2',
            fontWeight: '700',
            marginTop: '2em',
            marginBottom: '4px'
          },
          h2: {
            color: '#37352f',
            fontSize: '30px',
            lineHeight: '1.3',
            fontWeight: '600',
            marginTop: '1.4em',
            marginBottom: '1px'
          },
          h3: {
            color: '#37352f',
            fontSize: '24px',
            lineHeight: '1.3',
            fontWeight: '600',
            marginTop: '1em',
            marginBottom: '1px'
          },
          p: {
            marginTop: '3px',
            marginBottom: '3px'
          },
          code: {
            color: '#eb5757',
            backgroundColor: 'rgba(135,131,120,0.15)',
            borderRadius: '3px',
            fontSize: '85%',
            padding: '0.2em 0.4em',
            fontFamily: '"SFMono-Regular", Menlo, Consolas, "PT Mono", "Liberation Mono", Courier, monospace'
          },
          pre: {
            backgroundColor: 'rgba(135,131,120,0.15)',
            borderRadius: '3px',
            padding: '16px 16px 16px 12px',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#37352f',
            overflow: 'auto',
            marginTop: '3px',
            marginBottom: '3px'
          },
          blockquote: {
            fontSize: '16px',
            margin: '4px 0px',
            paddingLeft: '14px',
            borderLeft: '3px solid currentcolor',
            color: '#37352f',
            opacity: '0.8'
          },
          table: {
            borderCollapse: 'collapse',
            width: '100%',
            marginTop: '5px',
            marginBottom: '5px'
          },
          th: {
            backgroundColor: 'rgba(135,131,120,0.15)',
            border: '1px solid rgba(135,131,120,0.4)',
            borderLeft: 'none',
            borderTop: 'none',
            padding: '6px 8px',
            textAlign: 'left',
            fontSize: '14px',
            color: '#37352f'
          },
          td: {
            border: '1px solid rgba(135,131,120,0.4)',
            borderLeft: 'none',
            borderTop: 'none',
            padding: '6px 8px',
            fontSize: '14px'
          },
          a: {
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            textDecorationThickness: '1.2px',
            color: 'inherit',
            opacity: '0.8'
          },
          ul: {
            marginTop: '3px',
            marginBottom: '3px',
            paddingLeft: '1.625em'
          },
          ol: {
            marginTop: '3px',
            marginBottom: '3px',
            paddingLeft: '1.625em'
          },
          li: {
            marginTop: '2px',
            marginBottom: '2px'
          }
        },
        print: {
          background: '#ffffff',
          color: '#37352f',
          fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          fontSize: '11pt',
          lineHeight: '1.5',
          h1: {
            fontSize: '24pt',
            lineHeight: '1.2',
            fontWeight: '700',
            marginTop: '18pt',
            marginBottom: '6pt',
            pageBreakAfter: 'avoid'
          },
          h2: {
            fontSize: '18pt',
            lineHeight: '1.3',
            fontWeight: '600',
            marginTop: '16pt',
            marginBottom: '3pt',
            pageBreakAfter: 'avoid'
          },
          h3: {
            fontSize: '14pt',
            lineHeight: '1.3',
            fontWeight: '600',
            marginTop: '12pt',
            marginBottom: '3pt',
            pageBreakAfter: 'avoid'
          },
          p: {
            marginTop: '2pt',
            marginBottom: '2pt'
          },
          code: {
            backgroundColor: 'rgba(135,131,120,0.15)',
            borderRadius: '2pt',
            fontSize: '85%',
            padding: '1pt 2pt',
            fontFamily: '"SFMono-Regular", Menlo, Consolas, "PT Mono", "Liberation Mono", Courier, monospace'
          },
          pre: {
            backgroundColor: 'rgba(135,131,120,0.15)',
            borderRadius: '2pt',
            padding: '8pt',
            fontSize: '9pt',
            lineHeight: '1.5',
            overflow: 'visible',
            marginTop: '2pt',
            marginBottom: '2pt',
            pageBreakInside: 'avoid',
            whiteSpace: 'pre-wrap'
          },
          blockquote: {
            margin: '3pt 0pt',
            paddingLeft: '10pt',
            borderLeft: '2pt solid #000',
            opacity: '0.8'
          },
          table: {
            borderCollapse: 'collapse',
            width: '100%',
            marginTop: '3pt',
            marginBottom: '3pt',
            pageBreakInside: 'avoid'
          },
          th: {
            backgroundColor: 'rgba(135,131,120,0.15)',
            border: '1pt solid rgba(135,131,120,0.4)',
            borderLeft: 'none',
            borderTop: 'none',
            padding: '4pt 6pt',
            textAlign: 'left',
            fontSize: '10pt'
          },
          td: {
            border: '1pt solid rgba(135,131,120,0.4)',
            borderLeft: 'none',
            borderTop: 'none',
            padding: '4pt 6pt',
            fontSize: '10pt'
          },
          ul: {
            marginTop: '2pt',
            marginBottom: '2pt',
            paddingLeft: '15pt'
          },
          ol: {
            marginTop: '2pt',
            marginBottom: '2pt',
            paddingLeft: '15pt'
          },
          li: {
            marginTop: '1pt',
            marginBottom: '1pt'
          }
        }
      }
    ];
  }
}
