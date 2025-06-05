import { useCallback } from 'react'
import * as Three from 'three'
import { useThree } from './three'

export function useAnimate() {
  const { sceneRef, cameraRef, skyRef, rendererRef, orbitControlsRef } = useThree()

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !orbitControlsRef.current || !skyRef.current) return
    
    const animationId = requestAnimationFrame(animate)

    orbitControlsRef.current.update()
    rendererRef.current.render(sceneRef.current, cameraRef.current)

    skyRef.current.rotateOnWorldAxis(new Three.Vector3(1, 0, 0), 0.0005)

    return animationId
  }, [])

  return { animate }
}