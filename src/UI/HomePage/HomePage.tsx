import { useEffect, useRef } from "react"

import { render13ThreeDtext } from "../ThreeJS/13-3dText.ts"

import "./HomePage.scss"

// Only necessary to avoid double-mount in dev mode
let hasMounted = false

export default function HomePage() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvas?.current || hasMounted) {
      return
    }

    render13ThreeDtext(canvas.current)
    hasMounted = true
  }, [])

  return (
    <canvas ref={canvas} className="webgl"></canvas>
  )
}
