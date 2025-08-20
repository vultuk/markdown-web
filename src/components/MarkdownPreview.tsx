import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../hooks/useTheme';
import styles from '../styles/MarkdownPreview.module.css';
import '../styles/print.css';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { currentTheme, generateCSS } = useTheme();

  useEffect(() => {
    // Create print container on mount and update it when content changes
    const createOrUpdatePrintContainer = () => {
      let printContainer = document.getElementById('print-container');
      
      if (!printContainer) {
        printContainer = document.createElement('div');
        printContainer.id = 'print-container';
        printContainer.className = 'print-content';
        document.body.appendChild(printContainer);
      }
      
      if (contentRef.current) {
        printContainer.innerHTML = contentRef.current.innerHTML;
      }
    };

    createOrUpdatePrintContainer();

    // Update print container when content changes
    const observer = new MutationObserver(createOrUpdatePrintContainer);
    if (contentRef.current) {
      observer.observe(contentRef.current, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, [content]);

  // Apply theme styles
  useEffect(() => {
    if (!currentTheme || !contentRef.current) return;

    // Use setTimeout to ensure DOM elements are ready after React rendering
    const applyStyles = () => {
      const preview = contentRef.current;
      const printContainer = document.getElementById('print-container');
      
      if (!preview) return;
      
      // Generate CSS for preview and print
      const previewCSS = generateCSS(currentTheme, false);
      const printCSS = generateCSS(currentTheme, true);
      
      // Apply preview styles
      preview.style.cssText = previewCSS.container;
      
      // Apply element styles to preview
      Object.entries(previewCSS.elements).forEach(([element, css]) => {
        const elements = preview.querySelectorAll(element);
        elements.forEach(el => {
          (el as HTMLElement).style.cssText = css;
        });
      });

      // Apply styles to print container if it exists
      if (printContainer) {
        printContainer.style.cssText = printCSS.container;
        
        Object.entries(printCSS.elements).forEach(([element, css]) => {
          const elements = printContainer.querySelectorAll(element);
          elements.forEach(el => {
            (el as HTMLElement).style.cssText = css;
          });
        });
      }
    };

    // Apply styles on next tick to ensure DOM is ready
    setTimeout(applyStyles, 0);
  }, [currentTheme, content, generateCSS]);

  return (
    <div ref={contentRef} className={styles.preview}>
      <ReactMarkdown 
        key={currentTheme?.name || 'default'} 
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}