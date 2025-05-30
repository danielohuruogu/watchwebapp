import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

import { useCallback, useEffect } from 'react'

import { useThree } from './three'
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
  const backgroundColor = '#F7F7F7'

  const initScene = useCallback(() => {
    if (!ref.current) return

    if (sceneRef.current) return

    // SCENE SET UP
    const scene = new Three.Scene()
    scene.fog = new Three.Fog('#000000', 5, 20)
    scene.background = new Three.Color(backgroundColor)
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

    for (let i = 0; i < 3; i++) {
      const dirLight = new Three.DirectionalLight(0xffffff, 1)
      dirLight.position.set(i * 10 - 10, 30, 20)
      dirLight.castShadow = true
      dirLight.shadow.mapSize.width = 4096
      dirLight.shadow.mapSize.height = 4096
      dirLight.shadow.radius = 10
      dirLight.shadow.camera.near = 0.5
      dirLight.shadow.camera.far = 100
      dirLight.shadow.bias = -0.005
      dirLight.shadow.camera.left = -10
      dirLight.shadow.camera.right = 10
      dirLight.shadow.camera.top = 10
      dirLight.shadow.camera.bottom = -10
      dirLight.shadow.camera.updateProjectionMatrix()
      displayLightingRig.add(dirLight)
    }

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
    const screenshotButton = document.querySelector('#screenshot-button')

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

    screenshotButton.classList.toggle('hidden', autoRotate)

    // checking displayLights
    console.log('checking displayLights')
    if (displayLights) {
      // turn the fog and background to a darker color
      console.log('displayLights is true, turning down the lights.')
      gsap.to(sceneRef.current.fog, {
        far: 15,
        duration: 0.6,
        ease: 'power2.inOut'
      })
      gsap.to(sceneRef.current.background, {
        r: 0.329,
        g: 0.329, // #545454
        b: 0.329, // #545454,
        duration: 0.6,
        ease: 'power2.inOut'
      })
      // turn down hemispheric + bulb lights
      // gsap.to(hemisphericLightRef.current, {
      //   intensity: 0,
      //   duration: 1,
      //   ease: 'power2.inOut'
      // })
      // gsap.to(bulbLightRef.current, {
      //   intensity: 0,
      //   duration: 1,
      //   ease: 'power2.inOut'
      // })
    } else {
      console.log('displayLights is now false, making backgroun brighter.')
      gsap.to(sceneRef.current.fog, {
        far: 50,
        duration: 0.3,
        ease: 'power2.inOut'
      })
      gsap.to(sceneRef.current.background, {
        r: 247/255,
        g: 247/255,
        b: 247/255,
        duration: 0.3,
        ease: 'power2.inOut'
      })
      //turn up hemispheric + bulb light
      // gsap.to(hemisphericLightRef.current, {
      //   intensity: 1,
      //   duration: 1,
      //   ease: 'power2.inOut'
      // })
      // gsap.to(bulbLightRef.current, {
      //   intensity: 1,
      //   duration: 1,
      //   ease: 'power2.inOut'
      // })
    }

    displayLightsRef.current.children.forEach(light => {
      if (light instanceof Three.DirectionalLight) {
        if (displayLights) {
          gsap.to(light, {
            intensity: 1,
            duration: 1,
            ease: 'power2.inOut',
          })
        } else {
          gsap.to(light, {
            intensity: 0,
            duration: 1,
            ease: 'power2.inOut',
          })
        }
      }
    })    
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