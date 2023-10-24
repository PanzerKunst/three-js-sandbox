/* eslint-disable */
import { useEffect, useRef } from "react"
import { render08FullscreenAndResizing } from "../ThreeJS/08-FullscreenAndResizing.ts"

import "./HomePage.scss"

// Only necessary to avoid double-mount in dev mode
let hasMounted = false

export default function HomePage() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvas?.current || hasMounted) {
      return
    }

    render08FullscreenAndResizing(canvas.current)
    hasMounted = true
  }, [])

  return (
    <canvas ref={canvas} className="webgl"></canvas>
  )
}
