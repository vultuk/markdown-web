import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/MarkdownPreview.module.css';
import '../styles/print.css';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={contentRef} className={styles.preview}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}