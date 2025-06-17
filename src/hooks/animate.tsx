import { useCallback, useRef, useEffect } from 'react'
import * as Three from 'three'
import { useThree } from './three'

export function useAnimate() {
  const { sceneRef, cameraRef, skyRef, rendererRef, orbitControlsRef } = useThree()

  const animationIdRef = useRef<number>(0)

  const animate = useCallback(() => {
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !orbitControlsRef.current ||
      !skyRef.current
    ) return
    
    animationIdRef.current = requestAnimationFrame(animate)

    orbitControlsRef.current.update()
    rendererRef.current.render(sceneRef.current, cameraRef.current)

    skyRef.current.rotateOnWorldAxis(new Three.Vector3(1, 0, 0), 0.0005)
    return animationIdRef.current
  }, [sceneRef, cameraRef, rendererRef, orbitControlsRef, skyRef])

  useEffect(() => {
    animate()
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [animate])

  return { animate }
}