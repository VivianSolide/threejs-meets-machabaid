// Scène et contrôles
const container = document.getElementById("container")
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200)
const controls = new THREE.OrbitControls(camera, container)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)
controls.rotateSpeed = 0.2
controls.enablePan = false
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

// Sprite



// Tooltip
function addToolTip(position) {
  let spriteMap = new THREE.TextureLoader().load('info.png')
  let spriteMaterial = new THREE.SpriteMaterial({
    map: spriteMap
  })
  let sprite = new THREE.Sprite(spriteMaterial)
  sprite.position.copy(position.clone().normalize().multiplyScalar(30))
  scene.add(sprite)
}

// rayCaster
const rayCaster = new THREE.Raycaster()
function onClick(e) {
  let mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  )
  rayCaster.setFromCamera(mouse, camera)
  rayCaster.intersectObjects(scene.children)
  // let intersects = rayCaster.intersectObject(sphere)
  // if (intersects.length > 0) {
  //   addToolTip(intersects[0].point)
  // }
}
window.addEventListener('click', onClick)

addToolTip(new THREE.Vector3(12, 1, 1))

// Render
function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', onResize)

function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
render()
