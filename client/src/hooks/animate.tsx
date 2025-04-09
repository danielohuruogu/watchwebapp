import { useCallback } from 'react'
import { useThree } from '../hooks/three'

export function useAnimate() {
  const { sceneRef, cameraRef, rendererRef, orbitControlsRef, geometryRef } = useThree()

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

  return { animate }
}