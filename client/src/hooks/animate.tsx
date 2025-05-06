import { useCallback } from 'react'
import { useThree } from './three'

export function useAnimate() {
  const { sceneRef, cameraRef, rendererRef, orbitControlsRef } = useThree()

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !orbitControlsRef.current) return
    
    const animationId = requestAnimationFrame(animate)

    orbitControlsRef.current.update()
    rendererRef.current.render(sceneRef.current, cameraRef.current)

    return animationId
  }, [])

  return { animate }
}