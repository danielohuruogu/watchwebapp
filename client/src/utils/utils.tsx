import React, { createContext, useRef } from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


export const ThreeContext = createContext<{
  sceneRef: React.RefObject<Three.Scene | null>
  cameraRef: React.RefObject<Three.PerspectiveCamera | null>
  rendererRef: React.RefObject<Three.WebGLRenderer | null>
  geometryRef: React.RefObject<Three.Mesh | null>
  orbitControlsRef: React.RefObject<OrbitControls | null>
  loadFileCalled: React.RefObject<boolean>
} | null>(null)

export const ThreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sceneRef = useRef<Three.Scene | null>(null)
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null)
  const rendererRef = useRef<Three.WebGLRenderer | null>(null)
  const geometryRef = useRef<Three.Mesh | null>(null)
  const orbitControlsRef = useRef<OrbitControls | null>(null)
  const loadFileCalled = useRef<boolean>(false)

  return (
    <ThreeContext.Provider value={{ sceneRef, cameraRef, rendererRef, geometryRef, orbitControlsRef, loadFileCalled }}>
      {children}
    </ThreeContext.Provider>
  )
}