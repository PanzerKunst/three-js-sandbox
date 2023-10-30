import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { Coordinate } from "../../Util/ThreeUtils.ts"

export function render07Cameras(canvas: HTMLCanvasElement) {
  // Sizes
  const viewportSize = {
    width: 800,
    height: 600
  }

  /**
   * Cursor
   */
  const cursor: Coordinate = {
    x: 0,
    y: 0
  }

  window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / viewportSize.width - 0.5
    cursor.y = - (event.clientY / viewportSize.height - 0.5)

    console.log(cursor)
  })

  // Scene
  const scene = new THREE.Scene()

  // Object
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  scene.add(mesh)

  // Camera
  const aspectRatio = viewportSize.width / viewportSize.height
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
  // const camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 0.1, 100)

  // camera.position.x = 2
  // camera.position.y = 2
  camera.position.z = 3
  camera.lookAt(mesh.position)
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(viewportSize.width, viewportSize.height)

  // Animate
  // const clock = new THREE.Clock()

  function tick() {
    /* const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elapsedTime */

    // Update camera
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 5
    // camera.lookAt(mesh.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
}
