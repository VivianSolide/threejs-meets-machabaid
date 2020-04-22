// Scène et contrôles
const container = document.getElementById("container")
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200)
const controls = new THREE.OrbitControls(camera, container)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)
controls.rotateSpeed = 0.2
controls.enableZoom = false
controls.enablePan = false
controls.enableZoom = false
camera.position.set(-0.1, 0, 0)
controls.update()

// Sphère
const geometry = new THREE.SphereGeometry(50, 32, 32)
const texture = new THREE.TextureLoader().load('360.jpeg')
texture.minFilter = THREE.LinearFilter;
texture.wrapS = THREE.RepeatWrapping
texture.repeat.x = -1

const material = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide
})
material.transparent = true
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)
function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
render()