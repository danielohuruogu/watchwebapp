import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

import { useCallback, useEffect } from 'react'

import { useThree } from './three'
import { sizes, materials, colours, lights } from '../utils/constants'

export function useInitScene(ref: React.RefObject<HTMLDivElement | null>) {
  const {
    sceneRef,
    cameraRef,
    standardLightsRef,
    displayLightsRef,
    rendererRef,
    orbitControlsRef,
    autoRotate,
    displayLights
  } = useThree()

  const maxAspectRatio = window.innerWidth / window.innerHeight
  const backgroundColourStandard = colours.background.standard
  const backgroundColourDisplay = colours.background.display

  const groundLevel = -20

  const initScene = useCallback(() => {
    if (!ref.current) return

    if (sceneRef.current) return

    // SCENE SET UP
    const scene = new Three.Scene()
    scene.background = new Three.Color(backgroundColourStandard.r, backgroundColourStandard.g, backgroundColourStandard.b)
    scene.background.setHSL(0,0,.96) // off-white background, kinda grey

    const groundGeo = new Three.PlaneGeometry(10000, 10000)
  
    const ground = new Three.Mesh(groundGeo, materials.ground)
    ground.position.y = groundLevel
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // // LIGHTING
    // standard lights
    const standardLightsGroup = new Three.Group()
    const ambientLight = new Three.AmbientLight(0xffffff, lights.ambientLight.standard?.intensity as number)
    standardLightsGroup.add(ambientLight)

    const topLight = new Three.SpotLight(0xffffff, lights.topLight.standard?.intensity as number, 50, 0.3, 1)
    topLight.name = 'topLight'
    topLight.position.set(0, 5, 0)
    topLight.castShadow = true
    standardLightsGroup.add(topLight)

    const frontLight = new Three.SpotLight(0xffffff, 0.8)
    frontLight.name = 'frontLight'
    frontLight.position.set(0, 5, 2)
    frontLight.castShadow = true
    standardLightsGroup.add(frontLight)

    const leftLight = new Three.SpotLight(0xffffff, 0.5)
    leftLight.name = 'leftLight'
    leftLight.position.set(-5, 0, 1)
    standardLightsGroup.add(leftLight)

    const rightLight = new Three.SpotLight(0xffffff, 0.5)
    rightLight.name = 'rightLight'
    rightLight.position.set(5, 0, 1)
    standardLightsGroup.add(rightLight)

    // for display mode
    const displayLightsGroup = new Three.Group()
    const keyLight = new Three.SpotLight(0xffffff, 1500)
    keyLight.name = 'keyLight'
    keyLight.position.set(0, 8, 8)
    keyLight.angle = Math.PI / 6
    keyLight.penumbra = 0.5
    keyLight.decay = 2
    keyLight.distance = 10
    keyLight.castShadow = true
    displayLightsGroup.add(keyLight)

    const rimLight1 = new Three.SpotLight(0xffffff, 250, 50, 0.3, 1)
    rimLight1.position.set(-12, 2, -12)
    rimLight1.name = 'rimlight1'
    rimLight1.castShadow = true
    displayLightsGroup.add(rimLight1)

    const rimLight2 = new Three.SpotLight(0xffffff, 100, 50, 0.3, 1)
    rimLight2.position.set(5, -2, 10)
    rimLight2.name = 'rimlight2'
    rimLight2.castShadow = true
    displayLightsGroup.add(rimLight2)
    
    // backlights
    const backlightPositions = [
      [-16, 4, -4],
      [-8, 4, -8],
      [8, 4, -8],
      [16, 4, -4]
    ]

    backlightPositions.forEach((position) => {
      const backlight = new Three.PointLight(lights.backlights.display?.color as Three.ColorRepresentation, 250, 15)
      backlight.position.set(position[0], position[1], position[2])
      backlight.color = new Three.Color(lights.backlights.display?.color as Three.ColorRepresentation)
      backlight.castShadow = true
      displayLightsGroup.add(backlight)
    })

    scene.add(displayLightsGroup)
    scene.add(standardLightsGroup)

    // CAMERAS
    const camera = new Three.PerspectiveCamera(75, maxAspectRatio, 0.1, 1000)
    camera.position.set(-5, 5, 8)

    scene.add(camera)

    const renderer = new Three.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true

    renderer.setSize(sizes.sceneWidth as number, window.innerHeight, false)   

    // ORBIT CONTROLS
    // the orbit controls are to align with the display camera
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.dampingFactor = 0.3
    orbitControls.rotateSpeed = 1.5
    orbitControls.panSpeed = 1.25
    orbitControls.autoRotateSpeed = 4

    // SETTING REFS
    standardLightsRef.current = standardLightsGroup
    displayLightsRef.current = displayLightsGroup
    cameraRef.current = camera

    sceneRef.current = scene
    rendererRef.current = renderer
    orbitControlsRef.current = orbitControls

    ref.current.appendChild(renderer.domElement)
  }, [
      cameraRef,
      standardLightsRef,
      displayLightsRef,
      orbitControlsRef,
      ref,
      rendererRef,
      sceneRef
    ])

  useEffect(() => {
    // grab items to change
    const screenshotButton = document.querySelector('#screenshot-button')
    const header = document.querySelector('.header')

    if (!cameraRef.current || !sceneRef.current || !screenshotButton || !orbitControlsRef.current) {
      console.warn('Stuff not initialized.')
      return
    }

    if(!displayLightsRef.current || !standardLightsRef.current) {
      console.warn('Display lights or standard lights not initialized.')
      return
    }

    // update the orbitControls
    orbitControlsRef.current.autoRotate = autoRotate
    orbitControlsRef.current.dampingFactor = autoRotate ? 0.1 : 0.3
    orbitControlsRef.current.update()

    screenshotButton.classList.toggle('hidden', autoRotate)

    // checking displayLights
    if (displayLights) {
      // change header colour to white
      header?.classList.add('white-header')
      gsap.to(sceneRef.current.background, {
        r: backgroundColourDisplay.r,
        g: backgroundColourDisplay.g,
        b: backgroundColourDisplay.b,
        duration: 0.6,
        ease: 'power2.inOut'
      })
    } else {
      // change header colour to off-white
      header?.classList.remove('white-header')
      // change background back to standard
      console.log('background color before animating', sceneRef.current.background)
      console.log('set background color to', backgroundColourStandard)
      gsap.to(sceneRef.current.background, {
        r: backgroundColourStandard.r,
        g: backgroundColourStandard.g,
        b: backgroundColourStandard.b,
        duration: 0.3,
        ease: 'power2.inOut'
      })
      console.log('background color after animating', sceneRef.current.background)
    }

    standardLightsRef.current?.children.forEach(light => {
      if (displayLights) { // turn all lights down
        if (light instanceof Three.SpotLight) {
          gsap.to(light, {
            intensity: 0,
            duration: 1,
            ease: 'power2.inOut'
          })
        } else {
          gsap.to(light, {
            intensity: lights.ambientLight.display?.intensity as number,
            duration: 1,
            ease: 'power2.inOut'
          })
        }
      } else { //turn everything up
        if (light instanceof Three.AmbientLight) {
          gsap.to(light, {
            intensity: lights.ambientLight.standard?.intensity as number,
            duration: 1,
            ease: 'power2.inOut'
          })
        }
        if (light instanceof Three.SpotLight) {
          gsap.to(light, {
            intensity: light.name === 'topLight' ? lights.topLight.standard?.intensity
            : light.name === 'frontLight' ? lights.frontLight.standard?.intensity
            : light.name === 'leftLight' || light.name === 'rightLight' ? lights.sideLight.standard?.intensity
            : 0,
            duration: 1,
            ease: 'power2.inOut'
          })
        }
      }
    })

    displayLightsRef.current.children.forEach(light => {
      if (displayLights) {
        if (light instanceof Three.SpotLight) {
          gsap.to(light, {
            intensity: light.name === 'keyLight' ? lights.keyLight.display?.intensity
            : light.name === 'rimlight1' ? 250
            : 100,
            duration: 1,
            ease: 'power2.inOut',
          })
        }
        if (light instanceof Three.PointLight) {
          gsap.to(light, {
            intensity: lights.backlights.display?.intensity as number,
            duration: 1,
            ease: 'power2.inOut'
          })
        }
      } else {
        gsap.to(light, {
          intensity: 0,
          duration: 1,
          ease: 'power2.inOut'
        })
      }
    })    
  }, [autoRotate, displayLights])

  return {
    initScene,
    sceneRef,
    cameraRef,
    standardLightsRef,
    displayLightsRef,
    rendererRef,
    orbitControlsRef
  }
}