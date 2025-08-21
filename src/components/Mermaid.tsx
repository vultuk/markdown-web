import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

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
        mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme });
        const { svg } = await mermaid.render(idRef.current, code);
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

