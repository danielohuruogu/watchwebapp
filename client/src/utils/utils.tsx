import React, {createContext, useCallback, useRef} from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


export const AppContext = createContext<{
  sceneRef: React.RefObject<Three.Scene | null>
  cameraRef: React.RefObject<Three.PerspectiveCamera | null>
  rendererRef: React.RefObject<Three.WebGLRenderer | null>
  geometryRef: React.RefObject<Three.Mesh | null>
  modelsRef: React.RefObject<Array<Three.Object3D> | null>
  orbitControlsRef: React.RefObject<OrbitControls | null>
  loadFileCalled: React.RefObject<boolean>
  toggleVisibility: () => void
  loadModels: () => void
} | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sceneRef = useRef<Three.Scene | null>(null)
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null)
  const rendererRef = useRef<Three.WebGLRenderer | null>(null)
  const geometryRef = useRef<Three.Mesh | null>(null)
  const modelsRef = useRef<Array<Three.Object3D> | null>(null)
  const orbitControlsRef = useRef<OrbitControls | null>(null)
  const loadFileCalled = useRef<boolean>(false)

  const modelOneRef = useRef<Three.Object3D | null>(null)
  const modelTwoRef = useRef<Three.Object3D | null>(null)

  const loadModels = useCallback(() => {
    if (!modelsRef.current || modelsRef.current.length === 0) {
      console.error('modelsRef.current is not initialized or empty')
      return
    }

    modelOneRef.current = modelsRef.current[0]
    modelTwoRef.current = modelsRef.current[1]
    modelTwoRef.current.visible = false

    sceneRef.current?.add(modelOneRef.current)
    sceneRef.current?.add(modelTwoRef.current)
  }, [])

  const toggleVisibility = useCallback(() => {
    if (!modelOneRef.current || !modelTwoRef.current) {
      console.error('Models not loaded yet')
      return
    }
    modelOneRef.current.visible = !modelOneRef.current.visible
    modelTwoRef.current.visible = !modelTwoRef?.current.visible
  }, [])

  return (
    <AppContext.Provider value={{
      sceneRef,
      cameraRef,
      rendererRef,
      modelsRef,
      geometryRef,
      orbitControlsRef,
      loadFileCalled,
      loadModels,
      toggleVisibility
    }}>
      {children}
    </AppContext.Provider>
  )
}