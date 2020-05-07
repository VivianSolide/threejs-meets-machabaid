// Scène et contrôles
const container = document.getElementById("container")


class Scene {
  constructor(image, camera) {
    this.image = image
    this.camera = camera
    this.sprites = []
    this.points = []
  }

  createScene(scene) {
    this.scene = scene
    const geometry = new THREE.SphereGeometry(50, 32, 32)
    const texture = new THREE.TextureLoader().load(this.image)
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.RepeatWrapping
    texture.repeat.x = -1

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
    material.transparent = true
    this.sphere = new THREE.Mesh(geometry, material)
    this.scene.add(this.sphere)

    this.points.forEach(this.addToolTip.bind(this))
  }


  addPoint(point) {
    this.points.push(point)
  }

  addToolTip(point, name) {
    let spriteMap = new THREE.TextureLoader().load('info.png')
    let spriteMaterial = new THREE.SpriteMaterial({
      map: spriteMap
    })
    let sprite = new THREE.Sprite(spriteMaterial)
    sprite.name = point.name
    sprite.position.copy(point.position.clone().normalize().multiplyScalar(30))
    scene.add(sprite)
    this.sprites.push(sprite)
    sprite.onClick = () => {
      this.destroy(scene)
      point.scene.createScene(scene)
    }
  }

  destroy() {
    TweenLite.to(this.sphere.material, 1, {
      opacity: 0,
      onComplete: () => {
        this.scene.remove(this.sphere)
      }
    })
    this.sprites.forEach((sprite) => {
      () => {
        this.scene.remove(sprite)
      }
    })
  }

  appear() {
    this.sphere.material.opacity = 0
    TweenLite.to(this.sphere.material, 1, {
      opacity: 0,
    })
    this.sphere.material.opacity = 0
    TweenLite.to(this.sphere.material, 1, {
      opacity: 1
    })
  }
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200)
const controls = new THREE.OrbitControls(camera, container)
const renderer = new THREE.WebGLRenderer()
const rayCaster = new THREE.Raycaster()

renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)
controls.rotateSpeed = 0.2
controls.enablePan = false
camera.position.set(-0.1, 0, 0)
controls.update()

// Sphères
let s0 = new Scene('360-S0.jpeg', camera)
let s1 = new Scene('360-S1.jpeg', camera)

s0.addPoint({
  position: new THREE.Vector3(2, 0.5, 0),
  name: 'Home',
  scene: s1
})

s1.addPoint({
  position: new THREE.Vector3(3, 0.4, 5),
  name: 'Walk',
  scene: s0
})

s0.createScene(scene)
s0.appear()
// onResize
function onClick(e) {
  let mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  )
  rayCaster.setFromCamera(mouse, camera)
  let intersects = rayCaster.intersectObjects(scene.children)
  intersects.forEach(function (intersect) {
    if (intersect.object.type === 'Sprite') {
      intersect.object.onClick()
    }
  })
}
window.addEventListener('click', onClick)

// onResize
function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', onResize)

// Render
function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
render()