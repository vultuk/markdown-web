import React, { useEffect, useRef } from 'react';
// Use UMD build via script tag to avoid ESM initialization issues in some bundlers
// @ts-ignore - Vite will resolve this to a URL string
import mermaidUrl from 'mermaid/dist/mermaid.min.js?url';

interface MermaidProps {
  code: string;
  theme: 'default' | 'dark' | 'neutral' | 'forest';
}

export function Mermaid({ code, theme }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef<string>('mmd-' + Math.random().toString(36).slice(2));

  // Cache loader promise for UMD mermaid on window
  const mermaidLoaderRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        if (!mermaidLoaderRef.current) {
          mermaidLoaderRef.current = new Promise((resolve, reject) => {
            // If global already exists, resolve immediately
            const existing: any = (window as any).mermaid;
            if (existing) return resolve(existing);
            const s = document.createElement('script');
            s.src = mermaidUrl;
            s.async = true;
            s.onload = () => resolve((window as any).mermaid);
            s.onerror = () => reject(new Error('Failed to load mermaid'));
            document.head.appendChild(s);
          });
        }
        const m: any = await mermaidLoaderRef.current;
        m.initialize({ startOnLoad: false, securityLevel: 'strict', theme });
        const { svg } = await m.render(idRef.current, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled && containerRef.current) {
          containerRef.current.textContent = 'Mermaid diagram failed to render';
        }
      }
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [code, theme]);

  return <div ref={containerRef} aria-label="Mermaid diagram" />;
}
