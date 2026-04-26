'use client'

import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { cn } from '@/lib/utils'

type MdxMermaidProps = {
  chart: string
}

type SvgData = {
  html: string
  /** CSS aspect-ratio value derived from the SVG viewBox, e.g. "824 / 648" */
  ratio: string
}

/**
 * 1. Strip Mermaid's inline width/max-width that collapse the SVG.
 * 2. Expand the viewBox by PADDING px on every side so Android system fonts
 *    (Roboto, Samsung Sans …) — which are slightly wider than the desktop
 *    fonts Mermaid used for layout — don't overflow node boundaries.
 * 3. Return the CSS aspect-ratio so the container can match the SVG
 *    without a fixed px height.
 */
const VIEWBOX_PAD = 24

const parseSvg = (rawSvg: string): SvgData => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(rawSvg, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  if (!svg) return { html: rawSvg, ratio: '16 / 9' }

  // Remove inline width / max-width Mermaid injects
  const style = svg.getAttribute('style') ?? ''
  const cleaned = style
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('max-width') && !s.startsWith('width'))
    .join('; ')
  if (cleaned) svg.setAttribute('style', cleaned)
  else svg.removeAttribute('style')

  // Expand viewBox so wider mobile fonts still fit inside node rects
  let ratio = '16 / 9'
  const viewBox = svg.getAttribute('viewBox')
  if (viewBox) {
    const parts = viewBox.trim().split(/\s+/).map(Number)
    if (parts.length === 4 && parts[2]! > 0 && parts[3]! > 0) {
      const [x, y, w, h] = parts as [number, number, number, number]
      const p = VIEWBOX_PAD
      const nw = w + p * 2
      const nh = h + p * 2
      svg.setAttribute('viewBox', `${x - p} ${y - p} ${nw} ${nh}`)
      ratio = `${nw} / ${nh}`
    }
  }

  // Fill the container; height driven by aspect-ratio on the wrapper
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

  return { html: svg.outerHTML, ratio }
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

  // Render Mermaid → SVG; re-render when theme changes
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
        fontFamily: 'inherit',
        theme: isDark ? 'dark' : 'default',
        themeVariables: { fontSize: '16px' },
        // padding: internal space between label text and node border;
        // larger value → nodes are wider/taller → more room for wide fonts
        flowchart: { useMaxWidth: false, padding: 12 },
      })

      try {
        const { svg } = await mermaid.render(id, chart.replaceAll('\\n', '\n'))
        if (!cancelled) setSvgData(parseSvg(svg))
      } catch (err) {
        console.error('Mermaid render error:', err)
      }
    }
  }, [chart, id, isVisible])

  return (
    <figure className="my-6 w-full">
      <div
        ref={containerRef}
        role="region"
        aria-label="Интерактивная схема"
        className={cn(
          'w-full overflow-hidden',
          'rounded-lg border border-border/60 bg-muted/15',
          'cursor-grab active:cursor-grabbing',
          // Placeholder height before SVG is ready
          !svgData && 'min-h-[200px]',
        )}
        // Container height is driven by the SVG's own aspect ratio —
        // no px/vh values, so it grows/shrinks with the diagram on every device.
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
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
              <div
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
