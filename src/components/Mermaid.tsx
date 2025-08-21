import React, { useEffect, useRef } from 'react';

interface MermaidProps {
  code: string;
  theme: 'default' | 'dark' | 'neutral' | 'forest';
}

export function Mermaid({ code, theme }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef<string>('mmd-' + Math.random().toString(36).slice(2));

  // Cache mermaid module across renders to avoid double-initialization issues
  // and some bundler edge cases that can cause "Cannot access 'x' before initialization".
  // We also re-apply initialize to update theme safely.
  const mermaidLoaderRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        if (!mermaidLoaderRef.current) {
          // Prefer explicit ESM entry to avoid optimizer glitches
          mermaidLoaderRef.current = import('mermaid/dist/mermaid.esm.min.mjs').then((mod) => (mod as any).default || mod);
        }
        const m = await mermaidLoaderRef.current;
        try {
          m.initialize({ startOnLoad: false, securityLevel: 'strict', theme });
        } catch {}
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
