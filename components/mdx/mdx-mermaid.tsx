'use client';

import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { cn } from '@/lib/utils';

type MdxMermaidProps = {
  chart: string;
};

/** Strip Mermaid's auto-generated inline max-width/width so the SVG keeps its natural pixel size. */
const stripSvgAutoStyles = (rawSvg: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawSvg, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  if (!svg) return rawSvg;

  const style = svg.getAttribute('style') ?? '';
  const cleaned = style
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('max-width') && !s.startsWith('width'))
    .join('; ');

  if (cleaned) svg.setAttribute('style', cleaned);
  else svg.removeAttribute('style');

  return svg.outerHTML;
};

const useIsVisible = (ref: RefObject<HTMLDivElement | null>): boolean => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);

  return visible;
};

export const MdxMermaid = ({ chart }: MdxMermaidProps) => {
  const id = `mermaid-${useId().replaceAll(':', '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState('');
  const isVisible = useIsVisible(containerRef);

  // Render Mermaid → SVG string; re-render on theme change
  useEffect(() => {
    if (!isVisible) return;

    let cancelled = false;
    const root = document.documentElement;

    // Watch for light/dark mode toggles
    const mo = new MutationObserver(() => void renderChart());
    mo.observe(root, { attributes: true });

    void renderChart();

    return () => {
      cancelled = true;
      mo.disconnect();
    };

    async function renderChart() {
      const { default: mermaid } = await import('mermaid');
      const isDark = root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: 'inherit',
        theme: isDark ? 'dark' : 'default',
        themeVariables: { fontSize: '16px' },
        flowchart: { useMaxWidth: false, padding: 4 },
      });

      try {
        const { svg } = await mermaid.render(id, chart.replaceAll('\\n', '\n'));
        if (!cancelled) setSvgHtml(stripSvgAutoStyles(svg));
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    }
  }, [chart, id, isVisible]);

  // Notice: The manual BBox calculation useEffect was completely removed!

  return (
    <figure className="my-6 w-full">
      <div
        ref={containerRef}
        role="region"
        aria-label="Интерактивная схема"
        className={cn(
          'h-[60vh] min-h-[300px] w-full overflow-hidden',
          'rounded-lg border border-border/60 bg-muted/15',
          'cursor-grab active:cursor-grabbing'
        )}
      >
        {svgHtml && (
          <TransformWrapper
            minScale={0.05}
            maxScale={10}
            initialScale={1} // Enforces the 100% readable size
            centerOnInit={true} // Automatically centers the diagram on load
            limitToBounds={false}
            doubleClick={{ mode: 'reset' }}
            wheel={{ step: 0.08 }}
          >
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
              {/* Ensure the wrapper div takes up space properly */}
              <div
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            </TransformComponent>
          </TransformWrapper>
        )}
      </div>
    </figure>
  );
};

export const Mermaid = MdxMermaid;
