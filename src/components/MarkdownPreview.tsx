import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useTheme } from '../hooks/useTheme';
import styles from '../styles/MarkdownPreview.module.css';
import '../styles/print.css';
// Load highlight.js themes as strings so we can switch per theme at runtime
// Dark preview theme
// @ts-ignore - Vite inline import
import hljsDarkCss from 'highlight.js/styles/github-dark.css?inline';
// Light theme (used for light preview or print)
// @ts-ignore - Vite inline import
import hljsLightCss from 'highlight.js/styles/github.css?inline';
import { Mermaid } from './Mermaid';

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

      // Inject highlight.js CSS for preview depending on background brightness
      const isHex = (v: string) => /^#([0-9a-fA-F]{3}){1,2}$/.test(v);
      const hexToRgb = (hex: string) => {
        let h = hex.replace('#', '');
        if (h.length === 3) h = h.split('').map(c => c + c).join('');
        const num = parseInt(h, 16);
        return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
      };
      const luminance = (hex: string) => {
        const { r, g, b } = hexToRgb(hex);
        const srgb = [r, g, b].map(v => {
          const c = v / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
      };
      const chooseCss = (bg?: string) => {
        if (bg && isHex(bg)) {
          return luminance(bg) < 0.5 ? hljsDarkCss : hljsLightCss;
        }
        return hljsDarkCss; // default to dark
      };

      // Preview theme
      const previewCss = chooseCss((currentTheme as any).preview?.background);
      let styleEl = document.getElementById('hljs-preview-style') as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'hljs-preview-style';
        document.head.appendChild(styleEl);
      }
      if (styleEl.textContent !== previewCss) styleEl.textContent = previewCss;

      // Apply styles to print container if it exists
      if (printContainer) {
        printContainer.style.cssText = printCSS.container;
        
        Object.entries(printCSS.elements).forEach(([element, css]) => {
          const elements = printContainer.querySelectorAll(element);
          elements.forEach(el => {
            (el as HTMLElement).style.cssText = css;
          });
        });

        // Inject highlight CSS for print (prefer light unless print bg is dark)
        const printCssTheme = chooseCss((currentTheme as any).print?.background);
        let printStyle = printContainer.querySelector('style[data-hljs="print"]') as HTMLStyleElement | null;
        if (!printStyle) {
          printStyle = document.createElement('style');
          printStyle.setAttribute('data-hljs', 'print');
          printContainer.prepend(printStyle);
        }
        if (printStyle.textContent !== printCssTheme) printStyle.textContent = printCssTheme;
      }
    };

    // Apply styles on next tick to ensure DOM is ready
    setTimeout(applyStyles, 0);
  }, [currentTheme, content, generateCSS]);

  const isDarkBackground = (bg?: string) => {
    const isHex = (v: string) => /^#([0-9a-fA-F]{3}){1,2}$/.test(v);
    const hexToRgb = (hex: string) => {
      let h = hex.replace('#', '');
      if (h.length === 3) h = h.split('').map(c => c + c).join('');
      const num = parseInt(h, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    };
    const luminance = (hex: string) => {
      const { r, g, b } = hexToRgb(hex);
      const srgb = [r, g, b].map(v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    };
    if (bg && isHex(bg)) return luminance(bg) < 0.5;
    return true;
  };

  return (
    <div ref={contentRef} className={styles.preview}>
      <ReactMarkdown 
        key={currentTheme?.name || 'default'} 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true, detect: true }]]}
        components={{
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children || '');
            if (!inline && match && match[1].toLowerCase() === 'mermaid') {
              const dark = isDarkBackground((currentTheme as any)?.preview?.background);
              return <Mermaid code={code} theme={dark ? 'dark' : 'default'} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
