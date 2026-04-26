'use client'

import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { cn } from '@/lib/utils'

type MdxMermaidProps = {
  chart: string
}

type SvgData = {
  html: string
  ratio: string
}

type SvgBBox = {
  x: number
  y: number
  width: number
  height: number
}

const FONT_FAMILY =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const VIEWBOX_PAD = 24
const FALLBACK_RATIO = '16 / 9'
const WRAPPING_WIDTH = 170

const MERMAID_LABEL_STYLES = `
  .mermaid-diagram foreignObject {
    overflow: visible;
  }

  .mermaid-diagram .nodeLabel,
  .mermaid-diagram .nodeLabel p,
  .mermaid-diagram .nodeLabel span {
    box-sizing: border-box;
    max-width: ${WRAPPING_WIDTH}px;
    overflow-wrap: anywhere;
    white-space: normal;
    word-break: normal;
  }
`

const parseViewBox = (value: string | null): SvgBBox | null => {
  if (!value) return null

  const [x, y, width, height] = value.trim().split(/\s+/).map(Number)
  if (![x, y, width, height].every(Number.isFinite)) return null
  if (width <= 0 || height <= 0) return null

  return { x, y, width, height }
}

const formatRatio = ({ width, height }: SvgBBox): string =>
  `${width} / ${height}`

const formatViewBox = ({ x, y, width, height }: SvgBBox): string =>
  `${x} ${y} ${width} ${height}`

const padBBox = (bbox: SvgBBox, padding = VIEWBOX_PAD): SvgBBox => ({
  x: bbox.x - padding,
  y: bbox.y - padding,
  width: bbox.width + padding * 2,
  height: bbox.height + padding * 2,
})

const stripAutoSizing = (svg: SVGSVGElement): void => {
  const style = svg.getAttribute('style') ?? ''
  const cleaned = style
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('max-width') && !s.startsWith('width'))
    .join('; ')

  if (cleaned) svg.setAttribute('style', cleaned)
  else svg.removeAttribute('style')

  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
}

const readBBox = (el: SVGGraphicsElement): SvgBBox | null => {
  try {
    const bbox = el.getBBox()
    if (bbox.width <= 0 || bbox.height <= 0) return null
    return {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
    }
  } catch {
    return null
  }
}

const getDiagramGraphicsElement = (
  svg: SVGSVGElement,
): SVGGraphicsElement | null =>
  svg.querySelector<SVGGraphicsElement>('g.root') ??
  svg.querySelector<SVGGraphicsElement>('g.output') ??
  svg.querySelector<SVGGraphicsElement>('g') ??
  null

/**
 * Mermaid's outer SVG can contain a large viewport around the graph.
 * Measure the inner graphics group instead of the root <svg>; measuring the
 * root often returns the viewport itself, which is exactly the empty area we
 * are trying to remove.
 */
const measureContentBBox = (rawSvg: string): SvgBBox | null => {
  const host = document.createElement('div')
  host.style.cssText =
    'position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none;'
  document.body.appendChild(host)
  host.className = 'mermaid-diagram'
  host.innerHTML = rawSvg

  const svgEl = host.querySelector('svg')
  const graphicsEl = svgEl ? getDiagramGraphicsElement(svgEl) : null
  const bbox = graphicsEl ? readBBox(graphicsEl) : null

  document.body.removeChild(host)
  return bbox
}

const parseSvg = (rawSvg: string, contentBBox: SvgBBox | null): SvgData => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(rawSvg, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  if (!svg) return { html: rawSvg, ratio: FALLBACK_RATIO }

  stripAutoSizing(svg)

  const viewBox = contentBBox
    ? padBBox(contentBBox)
    : parseViewBox(svg.getAttribute('viewBox'))

  if (!viewBox) return { html: svg.outerHTML, ratio: FALLBACK_RATIO }

  svg.setAttribute('viewBox', formatViewBox(viewBox))

  return { html: svg.outerHTML, ratio: formatRatio(viewBox) }
}

const useIsVisible = (ref: RefObject<HTMLDivElement | null>): boolean => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        io.disconnect()
      }
    })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref])

  return visible
}

export const MdxMermaid = ({ chart }: MdxMermaidProps) => {
  const id = `mermaid-${useId().replaceAll(':', '')}`
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgData, setSvgData] = useState<SvgData | null>(null)
  const isVisible = useIsVisible(containerRef)

  useEffect(() => {
    if (!isVisible) return

    let cancelled = false
    const root = document.documentElement
    const mo = new MutationObserver(() => void renderChart())
    mo.observe(root, { attributes: true })
    void renderChart()
    return () => {
      cancelled = true
      mo.disconnect()
    }

    async function renderChart() {
      const { default: mermaid } = await import('mermaid')
      const isDark =
        root.classList.contains('dark') ||
        root.getAttribute('data-theme') === 'dark'

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: FONT_FAMILY,
        htmlLabels: true,
        markdownAutoWrap: true,
        theme: isDark ? 'dark' : 'default',
        themeVariables: {
          fontFamily: FONT_FAMILY,
          fontSize: '16px',
        },
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          wrappingWidth: WRAPPING_WIDTH,
          padding: 12,
        },
      })

      try {
        if ('fonts' in document) await document.fonts.ready
        if (cancelled) return
        const { svg } = await mermaid.render(id, chart.replaceAll('\\n', '\n'))
        if (cancelled) return
        const bbox = measureContentBBox(svg)
        setSvgData(parseSvg(svg, bbox))
      } catch (err) {
        console.error('Mermaid render error:', err)
      }
    }
  }, [chart, id, isVisible])

  return (
    <figure className="my-6 w-full">
      <style>{MERMAID_LABEL_STYLES}</style>
      <div
        ref={containerRef}
        role="region"
        aria-label="Интерактивная схема"
        className={cn(
          'mermaid-diagram',
          'w-full overflow-hidden',
          'rounded-lg border border-border/60 bg-muted/15',
          'cursor-grab active:cursor-grabbing',
          !svgData && 'min-h-[200px]',
        )}
        style={svgData ? { aspectRatio: svgData.ratio } : undefined}
      >
        {svgData && (
          <TransformWrapper
            minScale={0.1}
            maxScale={10}
            initialScale={1}
            centerOnInit
            limitToBounds={false}
            doubleClick={{ mode: 'reset' }}
            wheel={{ step: 0.08 }}
          >
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <div
                className="mermaid-diagram"
                style={{ width: '100%', height: '100%' }}
                dangerouslySetInnerHTML={{ __html: svgData.html }}
              />
            </TransformComponent>
          </TransformWrapper>
        )}
      </div>
    </figure>
  )
}

export const Mermaid = MdxMermaid
