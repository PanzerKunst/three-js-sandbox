import GUI from "lil-gui"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"

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

export function render3dText(canvas: HTMLCanvasElement) {
  /**
   * Debug
   */
  /* const gui = */
  new GUI()

  let viewport = getViewportDetails()

  // Scene
  const scene = new THREE.Scene()

  // Axes helper
  const axesHelper = new THREE.AxesHelper()
  scene.add(axesHelper)

  const loadingManager = new THREE.LoadingManager(() => {
    // Loading finished
  }, () => {
    // Loading in progress
  }, (error) => {
    console.error("Error loading", error)
  })

  /**
   * Textures
   */
  const textureLoader = new THREE.TextureLoader(loadingManager) // Can load multiple textures

  // Tons of other matcaps: https://github.com/nidorx/matcaps
  const matcapTexture = textureLoader.load("/images/textures/matcaps/4.png")

  /**
   * Fonts.
   * To convert to typeface: http://gero3.github.io/facetype.js/
   */
  const fontLoader = new FontLoader(loadingManager)
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const bevelThickness = 0.03
    const bevelSize = 0.02

    const textGeometry = new TextGeometry("Hello three.js", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 3,
      bevelEnabled: true,
      bevelThickness,
      bevelSize,
      bevelOffset: 0,
      bevelSegments: 2
    })

    /**
     * Centering the geometry
     */
    textGeometry.center()

    // Gives the illusion that the object is illuminated
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)
  })

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
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
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
}
