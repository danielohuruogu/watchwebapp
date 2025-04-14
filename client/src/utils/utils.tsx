import React, {createContext, useCallback, useRef} from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


interface partOptions {
  [key: string]: Three.Object3D[]
}
interface modelOptions {
  casings: partOptions
  straps: partOptions
  faces: partOptions
  body: partOptions
}

export const AppContext = createContext<{
  sceneRef: React.RefObject<Three.Scene | null>
  cameraRef: React.RefObject<Three.PerspectiveCamera | null>
  rendererRef: React.RefObject<Three.WebGLRenderer | null>
  geometryRef: React.RefObject<Three.Mesh | null>
  modelOptionsRef: React.RefObject<modelOptions | null>
  orbitControlsRef: React.RefObject<OrbitControls | null>
  loadedFiles: React.RefObject<boolean>
  toggleVisibility: () => void
  loadModels: () => void
} | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sceneRef = useRef<Three.Scene | null>(null)
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null)
  const rendererRef = useRef<Three.WebGLRenderer | null>(null)
  const geometryRef = useRef<Three.Mesh | null>(null)
  const modelOptionsRef = useRef<Array<Three.Object3D> | null>(null)
  const orbitControlsRef = useRef<OrbitControls | null>(null)
  const loadedFiles = useRef<boolean>(false)

  const loadModels = useCallback(() => {
    if (!modelOptionsRef.current || modelOptionsRef.current.length === 0) {
      console.error('modelsRef.current is not initialized or empty')
      return
    }

    modelOptionsRef.current.forEach(optionVersion => {
      optionVersion.forEach((option) => {
        if (option instanceof Three.Mesh) {
          sceneRef.current?.add(option)
        }
      })
    })
  }, [])

  // const toggleVisibility = useCallback(() => {
  //   if (!modelOneRef.current || !modelTwoRef.current) {
  //     console.error('Models not loaded yet')
  //     return
  //   }
  //   modelOneRef.current.visible = !modelOneRef.current.visible
  //   modelTwoRef.current.visible = !modelTwoRef?.current.visible
  // }, [])

  return (
    <AppContext.Provider value={{
      sceneRef,
      cameraRef,
      rendererRef,
      modelOptionsRef,
      geometryRef,
      orbitControlsRef,
      loadedFiles,
      loadModels,
      // toggleVisibility
    }}>
      {children}
    </AppContext.Provider>
  )
}