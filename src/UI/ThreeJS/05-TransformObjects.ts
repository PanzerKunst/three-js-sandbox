import * as THREE from "three"

export function render05TransformObjects(canvas: HTMLCanvasElement) {
  // Scene
  const scene = new THREE.Scene()

  /**
   * Axes Helper
   */
  const axesHelper = new THREE.AxesHelper()
  scene.add(axesHelper)

  /**
   * Objects
   */
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  /* const mesh = new THREE.Mesh(geometry, material)
  // mesh.position.x = 1
  scene.add(mesh)


  // Scale
  mesh.scale.x = 3

  // Rotation
  mesh.rotation.y = Math.PI * 0.5 */

  /**
   * Sizes
   */
  const sizes = {
    width: 800,
    height: 600
  }

  /**
   * Camera
   */
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
  /* camera.position.x = 1
  camera.position.y = 1 */
  camera.position.z = 6
  scene.add(camera)

  // Look at the cube
  // camera.lookAt(mesh.position)

  const cubeA = new THREE.Mesh(geometry, material)
  cubeA.position.set(1, 1, 0)

  const cubeB = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
  cubeB.position.set(-1, -1, 0)

  //create a group and add the two cubes
  //These cubes can now be rotated / scaled etc as a group
  const group = new THREE.Group()
  group.add(cubeA)
  group.add(cubeB)

  scene.add(group)

  group.position.y = 1

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.render(scene, camera)
}
