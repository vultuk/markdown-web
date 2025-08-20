import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import styles from '../styles/ExportButton.module.css';

interface ExportButtonProps {
  content: string;
  fileName: string | null;
}

export function ExportButton({ content, fileName }: ExportButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    const printContainer = document.getElementById('print-container');
    if (!printContainer) {
      console.error('Print container not found');
      return;
    }

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${getFileName()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    };

    try {
      await html2pdf().set(options).from(printContainer).save();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
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
      >
        Export
      </button>
      
      <button 
        className={styles.dropdownToggle}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        title="Export options"
      >
        ▼
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