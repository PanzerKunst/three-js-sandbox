import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

function getViewportDetails() {
  const width = window.innerWidth
  const height = window.innerHeight

  return {
    width,
    height,
    aspectRatio: width / height
  }
}

function updatePixelRatio(renderer: THREE.WebGLRenderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

export function render08FullscreenAndResizing(canvas: HTMLCanvasElement) {
  let viewport = getViewportDetails()

  // Scene
  const scene = new THREE.Scene()

  /**
   * Object
   */
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(75, viewport.aspectRatio, 0.1, 100)
  camera.position.z = 3
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(viewport.width, viewport.height)
  updatePixelRatio(renderer)

  /**
   * Animate
   */
  // const clock = new THREE.Clock()

  const tick = () => {
    // const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()

  window.addEventListener("resize", () => {
    viewport = getViewportDetails()

    camera.aspect = viewport.aspectRatio
    camera.updateProjectionMatrix()

    renderer.setSize(viewport.width, viewport.height)
    updatePixelRatio(renderer)
  })

  // Toggle fullscreen on double-click
  window.addEventListener("dblclick", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      canvas.requestFullscreen()
    }
  })
}
