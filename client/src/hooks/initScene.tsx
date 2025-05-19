import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useThree } from './three'
import { useCallback } from 'react' 

export function useInitScene(ref: React.RefObject<HTMLDivElement | null>) {
  const { sceneRef, cameraRef, rendererRef, orbitControlsRef } = useThree()

  const initScene = useCallback(() => {
    if (!ref.current) return

    if (sceneRef.current) return

    const scene = new Three.Scene()
    scene.background = new Three.Color(0xeeeeee)
    scene.add(new Three.AmbientLight(0x404040, 2))
    sceneRef.current = scene

    const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 8
    cameraRef.current = camera

    scene.add(camera)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(800, 600)
    rendererRef.current = renderer

    ref.current.appendChild(renderer.domElement)

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControlsRef.current = orbitControls
  }, [])

  return { initScene, sceneRef, cameraRef, rendererRef, orbitControlsRef }
}