import React, { useEffect, useRef } from 'react';
// Use UMD build via script tag to avoid ESM initialization issues in some bundlers
// Prefer local UMD asset first; fall back to CDN if needed
// @ts-ignore Vite will resolve this to a URL string
import mermaidLocalUrl from 'mermaid/dist/mermaid.min.js?url';
const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';

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
            const globalAny = window as any;
            if (globalAny.mermaid) return globalAny.mermaid;
            // Try local UMD first
            try {
              await new Promise<void>((resolve, reject) => {
                const s = document.createElement('script');
                s.src = mermaidLocalUrl;
                s.defer = true;
                s.onload = () => resolve();
                s.onerror = () => reject(new Error('local mermaid load failed'));
                document.head.appendChild(s);
              });
              if (globalAny.mermaid) return globalAny.mermaid;
            } catch {}
            // Fallback to CDN
            await new Promise<void>((resolve, reject) => {
              const s2 = document.createElement('script');
              s2.src = MERMAID_CDN;
              s2.defer = true;
              s2.onload = () => resolve();
              s2.onerror = () => reject(new Error('CDN mermaid load failed'));
              document.head.appendChild(s2);
            });
            return globalAny.mermaid;
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
