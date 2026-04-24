'use client'

import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { cn } from '@/lib/utils'

type MdxMermaidProps = {
  chart: string
}

type PanZoomInstance = {
  destroy: () => void
  zoom: (scale: number) => void
}

// Defer rendering until the user scrolls to the diagram
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
  // Separate refs: outer div is the IntersectionObserver target,
  // inner div receives the raw SVG via innerHTML (outside React's control)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const panZoomRef = useRef<PanZoomInstance | null>(null)
  const isVisible = useIsVisible(wrapperRef)

  useEffect(() => {
    if (!isVisible || !svgContainerRef.current) return

    let cancelled = false

    const renderChart = async () => {
      const { default: mermaid } = await import('mermaid')
      const isDark =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: 'inherit',
        theme: isDark ? 'dark' : 'default',
        themeVariables: { fontSize: '16px' },
        flowchart: { useMaxWidth: false, padding: 4 },
      })

      try {
        const { svg } = await mermaid.render(id, chart.replaceAll('\\n', '\n'))
        if (cancelled || !svgContainerRef.current) return

        // Direct DOM insertion — React never touches svgContainerRef's children
        svgContainerRef.current.innerHTML = svg

        const svgEl = svgContainerRef.current.querySelector<SVGSVGElement>('svg')
        if (!svgEl) return

        svgEl.style.width = '100%'
        svgEl.style.height = '100%'
        svgEl.style.maxWidth = 'none'

        const mod = await import('svg-pan-zoom')
        if (cancelled || !svgEl.isConnected) return

        const factory = (mod.default ?? mod) as unknown as (
          el: SVGSVGElement,
          opts: object,
        ) => PanZoomInstance

        panZoomRef.current?.destroy()
        panZoomRef.current = factory(svgEl, {
          zoomEnabled: true,
          panEnabled: true,
          controlIconsEnabled: false,
          mouseWheelZoomEnabled: true,
          dblClickZoomEnabled: true,
          preventMouseEventsDefault: true,
          fit: false,
          center: true,
          minZoom: 0.1,
          maxZoom: 10,
        })
        panZoomRef.current.zoom(1)
      } catch (err) {
        console.error('Mermaid render error:', err)
      }
    }

    void renderChart()

    return () => {
      cancelled = true
      panZoomRef.current?.destroy()
      panZoomRef.current = null
    }
  }, [chart, id, isVisible])

  return (
    <figure className="my-6 w-full">
      <div
        ref={wrapperRef}
        aria-label="Interactive diagram"
        className={cn(
          'h-[60vh] min-h-[400px] w-full overflow-hidden',
          'rounded-lg border border-border/60 bg-muted/15',
          'cursor-grab active:cursor-grabbing touch-none select-none',
        )}
      >
        <div ref={svgContainerRef} className="h-full w-full" />
      </div>
    </figure>
  )
}

export const Mermaid = MdxMermaid
