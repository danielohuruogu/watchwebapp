import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useThree } from './three'
import { useCallback, useEffect } from 'react'
import { sizes } from '../utils/constants'

export function useInitScene(ref: React.RefObject<HTMLDivElement | null>) {
  const {
    sceneRef,
    cameraRef,
    // hemisphericLightRef,
    // bulbLightRef,
    displayLightsRef,
    rendererRef,
    orbitControlsRef,
    autoRotate,
    displayLights
  } = useThree()

  const maxAspectRatio = window.innerWidth / window.innerHeight

  const initScene = useCallback(() => {
    if (!ref.current) return

    if (sceneRef.current) return

    // SCENE SET UP
    const scene = new Three.Scene()
    scene.add(new Three.AxesHelper(100))
    scene.add(new Three.GridHelper(1000, 1000))

    const groundGeo = new Three.PlaneGeometry( 10000, 10000 )
    const groundMat = new Three.MeshLambertMaterial( { color: 0xffffff } )
    groundMat.color.setHSL( 0.095, 1, 0.75 )
  
    const ground = new Three.Mesh(groundGeo, groundMat)
    ground.position.y = - 20
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    scene.add( ground )

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

    // for display mode
    const displayLightingRig = new Three.Group()

    const dirLight1 = new Three.DirectionalLight(0xffffff, 1)
    dirLight1.position.set(-10, 30, 20)

    const dirLight2 = new Three.DirectionalLight(0xffffff, 1)
    dirLight2.position.set(0, 30, 20)

    const dirLight3 = new Three.DirectionalLight(0xffffff, 1)
    dirLight3.position.set(10, 30, 20)

    displayLightingRig.add(dirLight1, dirLight2, dirLight3)
    displayLightingRig.visible = autoRotate

    // scene.add(hemisphericLight)
    // scene.add(bulbLight)
    scene.add(displayLightingRig)

    // CAMERAS
    const camera = new Three.PerspectiveCamera(75, maxAspectRatio, 0.1, 1000)
    scene.add(camera)

    const renderer = new Three.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    // renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = Three.PCFSoftShadowMap
    // renderer.toneMapping = Three.ReinhardToneMapping

    renderer.setSize(sizes.sceneWidth as number, window.innerHeight, false)   

    // ORBIT CONTROLS
    // the orbit controls are to align with the display camera
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.dampingFactor = 0.3
    orbitControls.rotateSpeed = 1.25
    orbitControls.panSpeed = 1.25
    orbitControls.autoRotateSpeed = 3

    displayLightingRig.lookAt(orbitControls.target)
    // // ADDING TO SCENE
    // // SETTING REFS
    // hemisphericLightRef.current = hemisphericLight
    // bulbLightRef.current = bulbLight
    displayLightsRef.current = displayLightingRig
    cameraRef.current = camera

    sceneRef.current = scene
    rendererRef.current = renderer
    orbitControlsRef.current = orbitControls

    ref.current.appendChild(renderer.domElement)
  }, [
      // bulbLightRef,
      cameraRef,
      // hemisphericLightRef,
      displayLightsRef,
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

    // set the camera + orbit controls to the scene
  }, [cameraRef, rendererRef, orbitControlsRef, sceneRef])

  useEffect(() => {
    // grab items to change
    const screenshotButton = document.querySelector('#screenshot')

    console.log('displayLightsRef: ', displayLightsRef.current)
    console.log('orbitControlsRef: ', orbitControlsRef.current)
    console.log('cameraRef: ', cameraRef.current)
    console.log('sceneRef: ', sceneRef.current)
    console.log('screenshotButton: ', screenshotButton)
    if (!cameraRef.current || !sceneRef.current || !screenshotButton || !displayLightsRef.current || !orbitControlsRef.current) {
      console.warn('Stuff not initialized.')
      return
    }
    // if (!hemisphericLightRef.current || !bulbLightRef.current) {
    //   console.warn('Hemispheric or bulb light not initialized.')
    //   return
    // }

    // update the orbitControls
    orbitControlsRef.current.autoRotate = autoRotate
    orbitControlsRef.current.dampingFactor = autoRotate ? 0.1 : 0.3
    orbitControlsRef.current.update()

    // will have to update the lighting and camera position
    sceneRef.current.background = new Three.Color().setHSL(0.6, 0, displayLights ? 0.5 : 1)

    screenshotButton.classList.toggle('hidden', autoRotate)

    const fog = new Three.Fog(new Three.Color().setHSL(0.6, 0, 1), 5, 20)
    if (autoRotate) {
      sceneRef.current.fog = fog
      // sceneRef.current.remove(hemisphericLightRef.current!)
    } else {
      sceneRef.current.fog = null
      // sceneRef.current.add(hemisphericLightRef.current!)
    }

    displayLightsRef.current.visible = displayLights
    
  }, [autoRotate, displayLights])

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