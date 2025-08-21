import React, { useEffect, useRef } from 'react';

interface MermaidProps {
  code: string;
  theme: 'default' | 'dark' | 'neutral' | 'forest';
}

export function Mermaid({ code, theme }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef<string>('mmd-' + Math.random().toString(36).slice(2));

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        const mod = await import('mermaid');
        const m: any = (mod as any).default || mod;
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
