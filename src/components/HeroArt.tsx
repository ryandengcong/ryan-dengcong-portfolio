import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Pause, Play } from 'lucide-react'

const Sculpture = lazy(() => import('./Sculpture'))

function Placeholder({ failed = false }: { failed?: boolean }) {
  return <img className="sculpture-placeholder" src={`${import.meta.env.BASE_URL}images/sculpture.svg`} alt="" data-testid={failed ? 'sculpture-error-fallback' : 'sculpture-loading'} />
}

class SculptureBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <Placeholder failed /> : this.props.children }
}

export default function HeroArt({ reducedMotion }: { reducedMotion: boolean }) {
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  const art = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    if (art.current) observer.observe(art.current)
    const onVisibilityChange = () => setTabVisible(!document.hidden)
    onVisibilityChange()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])
  return (
    <div className="hero-art" ref={art}>
      <div className="orbit orbit-one" aria-hidden="true" />
      <div className="orbit orbit-two" aria-hidden="true" />
      <span className="art-cross cross-one" aria-hidden="true">+</span>
      <span className="art-cross cross-two" aria-hidden="true">+</span>
      <div className="sculpture-canvas" role="img" aria-label="An abstract, polished silver knot sculpture. Decorative 3D artwork.">
        <SculptureBoundary>
          <Suspense fallback={<Placeholder />}>
            <Sculpture reducedMotion={reducedMotion || paused || !visible || !tabVisible} />
          </Suspense>
        </SculptureBoundary>
      </div>
      <div className="art-caption">
        <span><span className="tiny-dot" /> EXPLORING NEW DIMENSIONS</span>
        {!reducedMotion && (
          <button className="motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play sculpture animation' : 'Pause sculpture animation'} aria-pressed={paused}>
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        )}
      </div>
      <span className="art-coordinate" aria-hidden="true">FIG. 01 — FORM & FUNCTION</span>
    </div>
  )
}
