import { useEffect, useRef } from "react"

import { render12Materials } from "../ThreeJS/12-Materials.ts"

import "./HomePage.scss"

// Only necessary to avoid double-mount in dev mode
let hasMounted = false

export default function HomePage() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvas?.current || hasMounted) {
      return
    }

    render12Materials(canvas.current)
    hasMounted = true
  }, [])

  return (
    <canvas ref={canvas} className="webgl"></canvas>
  )
}
