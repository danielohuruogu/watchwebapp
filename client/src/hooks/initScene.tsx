import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useThree } from './three'
import { useCallback } from 'react'
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
    orbitControlsRef
  } = useThree()

  // const frustumSize = 10
  let activeCamera: Three.PerspectiveCamera | Three.OrthographicCamera | null = null

  const initScene = useCallback(() => {
    if (!ref.current) return

    if (sceneRef.current) return

    // SCENE SET UP
    const scene = new Three.Scene()
    scene.background = new Three.Color().setHSL(0.6, 0, 1)
    scene.fog = new Three.Fog(scene.background, 1, 5000)

    // const groundGeo = new Three.PlaneGeometry(10000, 10000)
    // const groundMat = materials.ground
    // const ground = new Three.Mesh(groundGeo, groundMat)
    // ground.position.y = -20
    // ground.rotation.x = - Math.PI / 2;
    // ground.receiveShadow = true

    // scene.add(ground)

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
    // const shadowHelper = new Three.CameraHelper(bulbLight.shadow.camera)

    const cameraPerspective = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const cameraOrthographic = new Three.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000)

    activeCamera = cameraPerspective

    const cameraRig = new Three.Group()
    cameraRig.add(cameraPerspective)
    cameraRig.add(cameraOrthographic)

    camera.position.z = 8

    // scene.add(shadowHelper)
    scene.add(camera)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(800, 600)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = Three.PCFSoftShadowMap
    renderer.toneMapping = Three.ReinhardToneMapping

    // ORBIT CONTROLS
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.dampingFactor = 0.07
    orbitControls.rotateSpeed = 1.25
    orbitControls.panSpeed = 1.25
    orbitControls.screenSpacePanning = true
    orbitControls.autoRotateSpeed = 5

    // SETTING REFS
    hemisphericLightRef.current = hemisphericLight
    bulbLightRef.current = bulbLight

    cameraRef.current = camera
    cameraPerspectiveRef.current = cameraPerspective
    cameraOrthographicRef.current = cameraOrthographic
    cameraRigRef.current = cameraRig
    activeCameraRef.current = activeCamera

    sceneRef.current = scene
    rendererRef.current = renderer
    orbitControlsRef.current = orbitControls

    ref.current.appendChild(renderer.domElement)
  }, [])

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