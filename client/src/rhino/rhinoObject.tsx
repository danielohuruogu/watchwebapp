import { useCallback, useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as Three from 'three'
// import {
//     Rhino3dmLoader,
//     // OBJLoader
// } from 'three/examples/jsm/Addons.js'

function RhinoToThree () {
  const ref = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Three.Scene>(null)
  const cameraRef = useRef<Three.PerspectiveCamera>(null)
  const geometryRef = useRef<Three.Mesh>(null)
  const orbitControlsRef = useRef<OrbitControls>(null)
  const rendererRef = useRef<Three.WebGLRenderer>(null)
  const loadFileCalled = useRef(false)

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !orbitControlsRef.current) return
    const animationId = requestAnimationFrame(animate)
    if (geometryRef.current) {
      geometryRef.current.rotation.x += 0.01
      geometryRef.current.rotation.y += 0.01
    }
    orbitControlsRef.current.update()
    rendererRef.current.render(sceneRef.current, cameraRef.current)
    return animationId
  }, [])

  const loadFile = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !orbitControlsRef.current) return
    if (loadFileCalled.current) {
      console.log('loadFile already called')
      return
    }

    // const modelPath = '/assets/circle_test.3dm'
    // const loader = new Rhino3dmLoader()
    // loader.setLibraryPath('https://unpkg.com/rhino3dm@8.4.0/')

    const geometry = new Three.BoxGeometry()
    const material = new Three.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const cube = new Three.Mesh(geometry, material)

    geometryRef.current = cube as Three.Mesh
    console.log('geometryRef.current is now: ', geometryRef.current)
    sceneRef.current?.add(cube)

    loadFileCalled.current = true
    console.log('loadFileCalled is now: ', loadFileCalled.current)
  }, [])

  const initScene = useCallback(() => {
    if (!ref.current) {
      console.error('ref.current is null - skipping initScene')
      return
    }

    const scene = new Three.Scene()
    
    sceneRef.current = scene

    const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    cameraRef.current = camera

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    rendererRef.current = renderer

    ref.current?.appendChild(renderer.domElement)

    // orbit controls
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControlsRef.current = orbitControls

    camera.position.z = 5

    console.log('finished initialising the scene')
  }, [])


  useEffect(() => {
    initScene()
    loadFile()
    const animationId = animate()

    return () => {
      // Cancel animation frame
      if (animationId) {
          cancelAnimationFrame(animationId)
      }
      // Remove the renderer from DOM
      if (rendererRef.current && ref.current) {
        ref.current.removeChild(rendererRef.current.domElement)
      }
      // Dispose Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [initScene, loadFile, animate])

  return <div ref={ref} />
}

export default RhinoToThree