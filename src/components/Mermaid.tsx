import React, { useEffect, useRef } from 'react';
// Use UMD build via script tag to avoid ESM initialization issues in some bundlers
const CDN_URL = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';

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
          mermaidLoaderRef.current = (async () => {
            const existing: any = (window as any).mermaid;
            if (existing) return existing;
            await new Promise<void>((resolve, reject) => {
              const s = document.createElement('script');
              s.src = CDN_URL;
              s.defer = true;
              s.onload = () => resolve();
              s.onerror = () => reject(new Error('Failed to load mermaid CDN'));
              document.head.appendChild(s);
            });
            return (window as any).mermaid;
          })();
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
