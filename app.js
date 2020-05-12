const container = document.getElementById("container")
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 10, 100)
const controls = new THREE.OrbitControls(camera, container)
const renderer = new THREE.WebGLRenderer()
const rayCaster = new THREE.Raycaster()

renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)
controls.rotateSpeed = 0.4
controls.enablePan = true
controls.enableZoom = true
controls.keyPanSpeed = 1000
camera.position.set(-0.1, 0, 0)
controls.update()

class Scene {
  constructor(image, camera, materials = []) {
    this.image = image
    this.camera = camera
    this.sprites = []
    this.points = []
    this.materials = materials
    this.geometry = new THREE.SphereGeometry(50, 32, 32)
  }

  createScene(scene) {
    this.scene = scene
    const texture = new THREE.TextureLoader().load(this.image)
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.RepeatWrapping
    texture.repeat.x = -1

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
    material.transparent = true

    this.sphere = new THREE.Mesh(this.geometry, material)
    this.scene.add(this.sphere)
    this.points.forEach(this.addToolTip.bind(this))
    this.addMaterials()
  }

  randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  addMaterials() {
    if (this.materials.length > 0) {
      for (let i = 0; i < this.materials.length; i++) {
        let tempGeo = new THREE.PlaneGeometry(10, 10, 20);
        let map = new THREE.TextureLoader().load(this.materials[i])
        let tempMaterial = new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide });
        let plane = new THREE.Mesh(tempGeo, tempMaterial);
        this.scene.add(plane)
        plane.position.set(this.randomNumber(-50, 50), this.randomNumber(-32, 32), this.randomNumber(-32, 32))
        // plane.rotation.x = this.randomNumber(-180, 180)
        plane.rotation.y = this.randomNumber(-360, 360)
        // plane.rotation.z = this.randomNumber(-32, 32)
      }
    }
  }


  addPoint(point) {
    this.points.push(point)
  }

  addToolTip(point) {
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
      this.scene.remove(sprite)
    })
    // removing all materials
    this.scene.children = []
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


const materials = {
  s0: {

  },
  s1: [
    "assets/s1/materials/mw-0.jpg",
    "assets/s1/materials/mw-1.jpg",
    "assets/s1/materials/mw-2.jpg",
    "assets/s1/materials/mw-3.jpg",
    "assets/s1/materials/mw-4.jpg",
    "assets/s1/materials/mw-5.jpg",
    "assets/s1/materials/mw-6.jpg",
    "assets/s1/materials/mw-7.jpg",
    "assets/s1/materials/mw-8.jpg",
    "assets/s1/materials/mw-9.jpg",
    "assets/s1/materials/mw-10.jpg",
    "assets/s1/materials/mw-11.jpg",
    "assets/s1/materials/mw-12.jpg",
    "assets/s1/materials/mw-13.jpg",
    "assets/s1/materials/mw-14.jpg",
    // "assets/s1/materials/mw-15.jpg",
    "assets/s1/materials/mw-16.jpg",
    "assets/s1/materials/mw-17.jpg",
    "assets/s1/materials/mw-18.jpg",
    "assets/s1/materials/mw-19.jpg",
    "assets/s1/materials/mw-20.jpg",
    "assets/s1/materials/mw-21.jpg",
    "assets/s1/materials/mw-22.jpg",
    "assets/s1/materials/mw-23.jpg",
    "assets/s1/materials/mw-24.jpg",
    "assets/s1/materials/mw-25.jpg",
    "assets/s1/materials/mw-26.jpg",
    "assets/s1/materials/mw-27.jpg",
    "assets/s1/materials/mw-28.jpg",
    "assets/s1/materials/mw-29.jpg",
    "assets/s1/materials/mw-30.jpg",
  ]
}


// Sphères
let s0 = new Scene('assets/s0/360.jpeg', camera)
let s1 = new Scene('assets/s1/360.jpeg', camera, materials.s1)

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

// onClick
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