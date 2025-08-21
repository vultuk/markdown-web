import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { useTheme } from '../hooks/useTheme';
import styles from '../styles/ExportButton.module.css';

interface ExportButtonProps {
  content: string;
  fileName: string | null;
  isPreviewMode: boolean;
}

export function ExportButton({ content, fileName, isPreviewMode }: ExportButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentTheme, generateCSS } = useTheme();

  const getFileName = () => {
    if (!fileName) return 'untitled';
    return fileName.replace(/\.md$/, '');
  };

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getFileName()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsDropdownOpen(false);
  };

  const exportToPDF = async () => {
    let containerElement: HTMLElement | null = null;
    let tempContainer: HTMLElement | null = null;

    try {
      if (isPreviewMode) {
        // Use existing print container when in preview mode
        containerElement = document.getElementById('print-container');
        if (!containerElement) {
          alert('Preview not ready. Please switch to Preview mode first.');
          return;
        }
      } else {
        // Create temporary container when in edit mode
        if (!currentTheme) {
          alert('Theme not loaded. Please try again.');
          return;
        }

        // Import marked for markdown processing
        const { marked } = await import('marked');
        
        // Configure marked with GFM
        marked.setOptions({
          gfm: true,
          breaks: true
        });

        // Create temporary container
        tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = '8.5in';
        tempContainer.style.visibility = 'hidden';
        document.body.appendChild(tempContainer);

        // Create content container
        const contentDiv = document.createElement('div');
        tempContainer.appendChild(contentDiv);

        // Convert markdown to HTML
        const htmlContent = await marked(content);
        contentDiv.innerHTML = htmlContent;

        // Apply theme styles
        const printCSS = generateCSS(currentTheme, true);
        contentDiv.style.cssText = printCSS.container;

        Object.entries(printCSS.elements).forEach(([element, css]) => {
          const elements = contentDiv.querySelectorAll(element);
          elements.forEach(el => {
            (el as HTMLElement).style.cssText = css;
          });
        });

        containerElement = contentDiv;
      }

      if (!containerElement) {
        throw new Error('Could not create content container for PDF export');
      }

      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${getFileName()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        }
      };

      await html2pdf().set(options).from(containerElement).save();
      setIsDropdownOpen(false);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Clean up temporary container
      if (tempContainer) {
        document.body.removeChild(tempContainer);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.exportContainer} ref={dropdownRef}>
      <button 
        className={styles.exportButton}
        onClick={downloadMarkdown}
        title="Export markdown file"
        aria-label="Export markdown file"
      >
        <span className={styles.exportIcon} aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <path d="M5 20h14v2H5z"/>
            <path d="M11 3h2v10h3l-4 4-4-4h3z"/>
          </svg>
        </span>
        <span className={styles.exportLabel}>Export</span>
      </button>
      
      <button 
        className={styles.dropdownToggle}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        title="Export options"
      >
        <span className={styles.exportCaret} aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <path d="M7 10l5 5 5-5H7z"/>
          </svg>
        </span>
        <span className={styles.exportCaretLabel}>Options</span>
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <button 
            className={styles.dropdownItem}
            onClick={downloadMarkdown}
          >
            Download as Markdown (.md)
          </button>
          <button 
            className={styles.dropdownItem}
            onClick={exportToPDF}
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}
