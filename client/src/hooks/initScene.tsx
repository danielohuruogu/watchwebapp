import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useThree } from './three'
import { useCallback, useEffect } from 'react'// import materials from '../utils/materials'

export function useInitScene(ref: React.RefObject<HTMLDivElement | null>) {
  const {
    sceneRef,
    cameraRef,
    // hemisphericLightRef,
    // bulbLightRef,
    rendererRef,
    orbitControlsRef,
    displayToggle
  } = useThree()

  // const frustumSize = 10
  // set up the scene, camera, lights and renderer and set them in the refs
  // const scene = new Three.Scene()
  // sceneRef.current = scene
  // const renderer = new Three.WebGLRenderer({ antialias: true })
  // rendererRef.current = renderer
  // const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  // cameraRef.current = camera
  // const hemisphericLight = new Three.HemisphereLight(0xddeeff, 0x0f0e0d, 1)
  // hemisphericLightRef.current = hemisphericLight
  // const bulbLight = new Three.PointLight(0xffffff, 1, 100, 2)
  // bulbLightRef.current = bulbLight

  // const controls = new OrbitControls(camera, renderer.domElement)
  // orbitControlsRef.current = controls

  const initScene = useCallback(() => {
    if (!ref.current) return

    if (sceneRef.current) return

    // SCENE SET UP
    const scene = new Three.Scene()
    scene.background = new Three.Color().setHSL(0.6, 0, 1)
    scene.add(new Three.AxesHelper(100))
    scene.add(new Three.GridHelper(100, 100))
    scene.fog = new Three.Fog(scene.background, 1, 5000)

    // // LIGHTING
    // const hemisphericLight = new Three.HemisphereLight(0xddeeff, 0x0f0e0d, 1)
    // hemisphericLight.intensity = 5

    // const bulbLight = new Three.PointLight(0xffffff, 1, 100, 2)
    // const bulbGeometry = new Three.SphereGeometry(1, 16, 8)
    // bulbLight.add(new Three.Mesh(bulbGeometry, materials.bulbLight))
    // bulbLight.power = 12000
    // bulbLight.position.set(0, 30, 20)
    // bulbLight.castShadow = true
    // bulbLight.shadow.mapSize.width = 4096
    // bulbLight.shadow.mapSize.height = 4096
    // bulbLight.shadow.radius = 10
    // bulbLight.shadow.camera.near = 0.5
    // bulbLight.shadow.camera.far = 100
    // bulbLight.shadow.camera.fov = 90
    // bulbLight.shadow.bias = -0.005

    // scene.add(hemisphericLight)
    // scene.add(bulbLight)

    // CAMERAS
    const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const displayCamera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    scene.add(camera)
    scene.add(displayCamera)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    // renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = Three.PCFSoftShadowMap
    // renderer.toneMapping = Three.ReinhardToneMapping

    // ORBIT CONTROLS
    // the orbit controls are to align with the display camera
    const orbitControls = new OrbitControls(displayCamera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.dampingFactor = 0.3
    orbitControls.rotateSpeed = 1.25
    orbitControls.panSpeed = 1.25
    orbitControls.autoRotateSpeed = 3

    // // SETTING REFS
    // hemisphericLightRef.current = hemisphericLight
    // bulbLightRef.current = bulbLight
    cameraRef.current = camera

    sceneRef.current = scene
    rendererRef.current = renderer
    orbitControlsRef.current = orbitControls

    ref.current.appendChild(renderer.domElement)
  }, [
      // bulbLightRef,
      cameraRef,
      // hemisphericLightRef,
      orbitControlsRef,
      ref,
      rendererRef,
      sceneRef
    ])

  useEffect(() => {
    if (!cameraRef.current || !rendererRef.current || !orbitControlsRef.current || !sceneRef.current) {
      console.warn('Camera, renderer, orbit controls or scene not initialized.')
      return
    }

    const yPosition = 5
    const zPosition = 8
    cameraRef.current.position.set(-5, yPosition, zPosition)

    // SETTING THE CAMERA POSITION
    // console.log('setting the camera position to the target of the orbit controls')
    // const newTarget = new Three.Vector3(0, 0, 0)
    // console.log('orbitControlsRef.current.target: ', orbitControlsRef.current.target)
    // newTarget.copy(orbitControlsRef.current.target)
    // console.log('newTarget: ', newTarget)
    // const newXPosition = newTarget.x + 5
    // console.log('newXPosition: ', newXPosition)
    const cameraToTarget = new Three.Vector3()
    cameraToTarget.subVectors(orbitControlsRef.current.target, cameraRef.current.position)
    console.log('Camera to target vector:', cameraToTarget)

    const newTarget = orbitControlsRef.current.target.clone()
    const newXPosition = newTarget.x + 3
    newTarget.set(newXPosition, orbitControlsRef.current.target.y, orbitControlsRef.current.target.z)
    console.log('current camera position', cameraRef.current.position)
    console.log('current target position:', orbitControlsRef.current.target)
    console.log('New target position:', newTarget)
    const newCameraPosition = new Three.Vector3(cameraRef.current.position.x + 3, yPosition, zPosition)
    console.log('New camera position:', newCameraPosition)
    cameraRef.current.position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z)
    console.log('Camera position after set:', cameraRef.current.position)
    cameraRef.current.lookAt(newTarget)
    orbitControlsRef.current.target.copy(newTarget)
    orbitControlsRef.current.update()

    const newCameraToTarget = new Three.Vector3()
    newCameraToTarget.subVectors(newTarget, cameraRef.current.position)
    console.log('new cameraToTarget vector after setting position:', newCameraToTarget)

    // set the camera + orbit controls to the scene
  }, [cameraRef, rendererRef, orbitControlsRef, sceneRef])

  useEffect(() => {
      const configContainer = document.querySelector('.config-container')
    if (!cameraRef.current || !configContainer) {
      console.warn('Camera or config container not initialized.')
      return
    }
    if (!orbitControlsRef.current) {
      console.warn('OrbitControls not initialized.')
      return
    }
    if (!configContainer) {
      console.warn('Config container not found.')
      return
    }

    orbitControlsRef.current.autoRotate = displayToggle
    orbitControlsRef.current.dampingFactor = displayToggle ? 0.1 : 0.3
    orbitControlsRef.current.update()

    configContainer.classList.toggle('hidden', displayToggle)
  }, [displayToggle])

  return {
    initScene,
    sceneRef,
    cameraRef,
    // hemisphericLightRef,
    // bulbLightRef,
    rendererRef,
    orbitControlsRef
  }
}