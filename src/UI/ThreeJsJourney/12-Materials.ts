import GUI from "lil-gui"
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

export function render12Materials(canvas: HTMLCanvasElement) {
  /**
   * Debug
   */
  const gui = new GUI()

  let viewport = getViewportDetails()

  // Scene
  const scene = new THREE.Scene()

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
  const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

  /* eslint-disable no-unused-vars */

  const doorColorTexture = textureLoader.load("textures/door/color.jpg", () => {
    // Loading finished
  }, () => {
    // Loading in progress, never works
  }, () => {
    // Error loading the texture
  })

  /* Good resources for textures:
  - poliigon.com
  - 3dtextures.me
  - arroway-textures.ch */

  const doorAlphaTexture = textureLoader.load("textures/door/alpha.jpg")
  const doorHeightTexture = textureLoader.load("textures/door/height.jpg")
  const doorNormalTexture = textureLoader.load("textures/door/normal.jpg")
  const doorAmbientOcclusionTexture = textureLoader.load("textures/door/ambientOcclusion.jpg")
  const doorMetalnessTexture = textureLoader.load("textures/door/metalness.jpg")
  const doorRoughnessTexture = textureLoader.load("textures/door/roughness.jpg")

  const matcapTexture = textureLoader.load("textures/matcaps/1.png")
  const gradientTexture = textureLoader.load("textures/gradients/3.jpg")
  gradientTexture.minFilter = THREE.NearestFilter
  gradientTexture.magFilter = THREE.NearestFilter

  if (gradientTexture.minFilter === THREE.NearestFilter) {
    gradientTexture.generateMipmaps = false
  }

  // More HDRIs at https://polyhaven.com/
  // Convert via https://matheowis.github.io/HDRI-to-CubeMap/
  const environmentTexture = cubeTextureLoader.setPath("textures/environmentMaps/industrial_sunset_puresky_4k/")
    .load([
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png"
    ])

  /**
   * Objects
   */
  /* const material = new THREE.MeshBasicMaterial()
  material.map = doorColorTexture
  // material.color.set("red")
  // material.wireframe = true

  // material.opacity = 0.5
  // material.transparent = true

  material.alphaMap = doorAlphaTexture
  material.transparent = true

  // material.side = THREE.DoubleSide */

  /* const material = new THREE.MeshNormalMaterial
  material.flatShading = true */

  // Gives the illusion that the object is illuminated
  // const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

  // const material = new THREE.MeshDepthMaterial

  // Reacts to light
  // const material = new THREE.MeshLambertMaterial()

  // Reacts to light
  /* const material = new THREE.MeshPhongMaterial() // Less performant than MeshLambertMaterial
  material.shininess = 1200
  material.specular = new THREE.Color("red") */

  // Reacts to light
  /* const material = new THREE.MeshToonMaterial()
  material.gradientMap = gradientTexture */

  // Reacts to light
  /* const material = new THREE.MeshStandardMaterial()
  material.map = doorColorTexture
  material.aoMap = doorAmbientOcclusionTexture
  material.metalnessMap = doorMetalnessTexture
  material.roughnessMap = doorRoughnessTexture
  material.normalMap = doorNormalTexture

  material.displacementMap = doorHeightTexture
  material.displacementScale = 0.02

  material.alphaMap = doorAlphaTexture
  material.transparent = true */

  /**
   * Environment map
   */
  const material = new THREE.MeshStandardMaterial()
  material.metalness = 0.7
  material.roughness = 0.2
  material.envMap = environmentTexture

  // Debug material
  const tweaks = {
    normalScale: material.normalScale.x
  }

  gui.add(material, "metalness")
    .name("Metalness")
    .min(0).max(1).step(0.01)

  gui.add(material, "roughness")
    .name("Roughness")
    .min(0).max(1).step(0.01)

  gui.add(material, "aoMapIntensity")
    .name("Ambient occlusion")
    .min(0).max(10).step(0.1)

  gui.add(material, "displacementScale")
    .name("Height scale")
    .min(0).max(1).step(0.01)

  gui.add(tweaks, "normalScale")
    .name("Normal scale")
    .min(0).max(10).step(0.1)
    .onChange((value: number) => {
      material.normalScale.x = value
      material.normalScale.y = value
    })

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
  )

  sphere.position.x = 2

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
  )

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
  )

  torus.position.x = -2
  scene.add(sphere, plane, torus)


  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 40)
  pointLight.position.x = 2
  pointLight.position.y = 3
  pointLight.position.z = 4
  scene.add(pointLight)


  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(75, viewport.aspectRatio, 0.1, 100)
  camera.position.z = 5
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
  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    /* sphere.rotation.y = elapsedTime * 0.1
    plane.rotation.y = elapsedTime * 0.1
    torus.rotation.y = elapsedTime * 0.1

    sphere.rotation.x = elapsedTime * 0.15
    plane.rotation.x = elapsedTime * 0.15
    torus.rotation.x = elapsedTime * 0.15 */

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
