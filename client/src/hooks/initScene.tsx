import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useThree } from './three'
import { useCallback, useEffect } from 'react'
import materials from '../utils/materials'

export function useInitScene(ref: React.RefObject<HTMLDivElement | null>) {
  const {
    sceneRef,
    cameraRef,
    cameraOrthographicRef,
    cameraPerspectiveRef,
    cameraRigRef,
    activeCameraRef,
    hemisphericLightRef,
    bulbLightRef,
    rendererRef,
    orbitControlsRef,
    displayToggle
  } = useThree()

  // const frustumSize = 10
  let activeCamera: Three.PerspectiveCamera | Three.OrthographicCamera | null = null
  let scene
  let cameraPerspective: Three.PerspectiveCamera | null = null
  let renderer: Three.WebGLRenderer | null = null

  const initScene = useCallback(() => {
    if (!ref.current) return

    if (sceneRef.current) return

    // SCENE SET UP
    scene = new Three.Scene()
    scene.background = new Three.Color().setHSL(0.6, 0, 1)
    scene.fog = new Three.Fog(scene.background, 1, 5000)

    // LIGHTING
    const hemisphericLight = new Three.HemisphereLight(0xddeeff, 0x0f0e0d, 1)
    hemisphericLight.intensity = 5

    const bulbLight = new Three.PointLight(0xffffff, 1, 100, 2)
    const bulbGeometry = new Three.SphereGeometry(1, 16, 8)
    bulbLight.add(new Three.Mesh(bulbGeometry, materials.bulbLight))
    bulbLight.power = 12000
    bulbLight.position.set(0, 30, 20)
    bulbLight.castShadow = true
    bulbLight.shadow.mapSize.width = 4096
    bulbLight.shadow.mapSize.height = 4096
    bulbLight.shadow.radius = 10
    bulbLight.shadow.camera.near = 0.5
    bulbLight.shadow.camera.far = 100
    bulbLight.shadow.camera.fov = 90
    bulbLight.shadow.bias = -0.005

    scene.add(hemisphericLight)
    scene.add(bulbLight)

    // CAMERAS
    const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    // const cameraPerspective = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    // const cameraOrthographic = new Three.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000)

    // activeCamera = cameraPerspective

    // const cameraRig = new Three.Group()
    // cameraRig.add(cameraPerspective)
    // cameraRig.add(cameraOrthographic)

    camera.position.z = 8

    scene.add(camera)

    renderer = new Three.WebGLRenderer()
    renderer.setSize(800, 600)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = Three.PCFSoftShadowMap
    renderer.toneMapping = Three.ReinhardToneMapping

    // ORBIT CONTROLS
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.dampingFactor = 0.3
    orbitControls.rotateSpeed = 1.25
    orbitControls.panSpeed = 1.25
    orbitControls.screenSpacePanning = true
    orbitControls.autoRotateSpeed = 5

    // SETTING REFS
    hemisphericLightRef.current = hemisphericLight
    bulbLightRef.current = bulbLight

    cameraRef.current = camera
    cameraPerspectiveRef.current = cameraPerspective
    // cameraOrthographicRef.current = cameraOrthographic
    // cameraRigRef.current = cameraRig
    activeCameraRef.current = activeCamera

    sceneRef.current = scene
    rendererRef.current = renderer
    orbitControlsRef.current = orbitControls

    ref.current.appendChild(renderer.domElement)
  }, [])

  useEffect(() => {
    // will toggle the camera rig, active camera and config display
    if (displayToggle) {
      // change the position of the active camera to focus on the model
      // TODO: implement a class holder in a ref for the component and layout to access
      const configContainer = document.querySelector('.config-container')
      if (configContainer) {
        configContainer.classList.toggle('hidden', displayToggle)
      }
    } else {
      // default camera position
      // change the camera position to its default
    }
  }, [displayToggle])

  return {
    initScene,
    sceneRef,
    cameraRef,
    cameraOrthographicRef,
    cameraPerspectiveRef,
    cameraRigRef,
    activeCameraRef,
    hemisphericLightRef,
    bulbLightRef,
    rendererRef,
    orbitControlsRef
  }
}