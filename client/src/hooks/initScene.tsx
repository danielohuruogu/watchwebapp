import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

import { useCallback, useEffect } from 'react'

import { useThree } from './three'
import { aspectRatio, sizes, materials, lights } from '../utils/constants'

export function useInitScene(ref: React.RefObject<HTMLDivElement | null>) {
  const {
    sceneRef,
    cameraRef,
    skyRef,
    standardLightsRef,
    displayLightsRef,
    rendererRef,
    orbitControlsRef,
    autoRotate,
    displayLights
  } = useThree()

  const groundLevel = -20

  const initScene = useCallback(() => {
    if (!ref.current) return

    if (sceneRef.current) return

    // // SCENE SET UP
    const scene = new Three.Scene()
    scene.background = new Three.Color().setHSL(0.6,0,1)
    scene.fog = new Three.Fog( scene.background, 1, sizes.sceneSize as number )

    const groundGeo = new Three.PlaneGeometry(sizes.sceneSize as number, sizes.sceneSize as number)
  
    const groundMat = materials.ground as Three.MeshLambertMaterial
    const ground = new Three.Mesh(groundGeo, groundMat)
    ground.position.y = groundLevel
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // // SKY DOME
    const skyGeo = new Three.SphereGeometry(sizes.sceneSize as number, 32, 15)
    const skyMat = materials.skyDomeGradient as Three.ShaderMaterial
    const sky = new Three.Mesh(skyGeo, skyMat)
    sky.material.opacity = 0
    sky.rotateOnWorldAxis(new Three.Vector3(1, 0, 0), 0.0005)
    scene.add(sky)

    // // LIGHTING
    // standard lights
    const standardLightsGroup = new Three.Group()
    const ambientLight = new Three.AmbientLight(0xffffff, lights.ambientLight.standard?.intensity as number)
    standardLightsGroup.add(ambientLight)

    const topLight = new Three.SpotLight(0xffffff, lights.topLight.standard?.intensity as number, 50, 0.3, 1)
    topLight.name = 'topLight'
    topLight.position.set(0, 5, 0)
    topLight.castShadow = true
    topLight.shadow.bias = -0.001
    topLight.shadow.normalBias = 0.01
    standardLightsGroup.add(topLight)

    const frontLight = new Three.SpotLight(0xffffff, 0.8)
    frontLight.name = 'frontLight'
    frontLight.position.set(0, 5, 2)
    frontLight.castShadow = true
    frontLight.shadow.bias = -0.001
    frontLight.shadow.normalBias = 0.01
    standardLightsGroup.add(frontLight)

    const leftLight = new Three.SpotLight(0xffffff, 0.5)
    leftLight.name = 'leftLight'
    leftLight.position.set(-5, 0, 1)
    leftLight.shadow.bias = -0.001
    leftLight.shadow.normalBias = 0.01
    standardLightsGroup.add(leftLight)

    const rightLight = new Three.SpotLight(0xffffff, 0.5)
    rightLight.name = 'rightLight'
    rightLight.position.set(5, 0, 1)
    rightLight.shadow.bias = -0.001
    rightLight.shadow.normalBias = 0.01
    standardLightsGroup.add(rightLight)

    // for display mode
    const displayLightsGroup = new Three.Group()

    const keyLight = new Three.SpotLight(0xffffff, lights.keyLight.standard?.intensity as number, 70, Math.PI/6, 0.5)
    keyLight.name = 'keyLight'
    keyLight.position.set(0, 8, 8)
    keyLight.shadow.bias = -0.001
    keyLight.shadow.normalBias = 0.01
    keyLight.shadow.mapSize.width = 4096
    keyLight.shadow.mapSize.height = 4096
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 50
    keyLight.castShadow = true
    displayLightsGroup.add(keyLight)

    const rimLight1 = new Three.SpotLight(0xffffff, lights.rimLight1.display?.intensity as number, 50, 0.3, 1)
    rimLight1.position.set(-12, 2, -12)
    rimLight1.name = 'rimlight1'
    rimLight1.castShadow = true
    rimLight1.shadow.bias = -0.001
    rimLight1.shadow.normalBias = 0.01
    rimLight1.shadow.camera.near = 0.5
    rimLight1.shadow.camera.far = 50
    displayLightsGroup.add(rimLight1)

    const rimLight2 = new Three.SpotLight(0xffffff, lights.rimLight2.display?.intensity as number, 50, 0.3, 1)
    rimLight2.position.set(5, -2, 10)
    rimLight2.name = 'rimlight2'
    rimLight2.castShadow = true
    rimLight2.shadow.bias = -0.001
    rimLight2.shadow.normalBias = 0.01
    rimLight2.shadow.camera.near = 0.5
    rimLight2.shadow.camera.far = 50
    displayLightsGroup.add(rimLight2)
    
    // backlights
    const backlightPositions = [
      [-16, 4, -4],
      [-8, 4, -8],
      [8, 4, -8],
      [16, 4, -4]
    ]

    backlightPositions.forEach((position) => {
      const backlight = new Three.PointLight(
        lights.backlights.display?.color as Three.ColorRepresentation,
        lights.backlights.display?.intensity as number,
        15)
      backlight.position.set(position[0], position[1], position[2])
      backlight.color = new Three.Color(lights.backlights.display?.color as Three.ColorRepresentation)
      backlight.castShadow = true
      backlight.shadow.bias = -0.001
      backlight.shadow.normalBias = 0.01
      displayLightsGroup.add(backlight)
    })

    scene.add(displayLightsGroup)
    scene.add(standardLightsGroup)

    // // CAMERAS
    const camera = new Three.PerspectiveCamera(75, aspectRatio, 0.1, (sizes.sceneSize  as number) + 2000)
    camera.position.set(-5, 5, 8)

    scene.add(camera)

    // // RENDERER
    const renderer = new Three.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = Three.PCFSoftShadowMap
    renderer.setSize(sizes.renderSceneWidth as number, sizes.renderSceneHeight as number, false)   

    // // ORBIT CONTROLS
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.dampingFactor = 0.3
    orbitControls.rotateSpeed = 1.5
    orbitControls.panSpeed = 1.25
    orbitControls.autoRotateSpeed = 4

    // // SETTING REFS
    standardLightsRef.current = standardLightsGroup
    displayLightsRef.current = displayLightsGroup
    cameraRef.current = camera
    skyRef.current = sky

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

    if (!cameraRef.current || !sceneRef.current || !screenshotButton || !orbitControlsRef.current || !skyRef.current) {
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

    if (displayLights) {
      header?.classList.add('white-header')
      if (
        skyRef.current.material instanceof Three.ShaderMaterial
        && skyRef.current.material.uniforms.opacity
      ) {
        gsap.to(skyRef.current.material.uniforms.opacity, { // get the sky to appear
          value: 1,
          duration: 0.6,
          ease: 'power2.inOut'
        })
      }
      gsap.to(sceneRef.current.fog, {
        far: 1000,
        duration: 0.6,
        ease: 'power2.inOut'
      })
    } else {
      header?.classList.remove('white-header')
      if (
        skyRef.current.material instanceof Three.ShaderMaterial
        && skyRef.current.material.uniforms.opacity
      ) {
        gsap.to(skyRef.current.material.uniforms.opacity, { // get the sky to disappear
          value: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        })
      }
      gsap.to(sceneRef.current.fog, {
        far: sizes.sceneSize as number,
        duration: 0.3,
        ease: 'power2.inOut'
      })
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