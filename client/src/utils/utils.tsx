import React, {createContext, useCallback, useRef} from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export interface partOptions {
  [key: string]: Three.Object3D[]
}
export interface modelOptions {
  [key:string ]: partOptions
}

export const AppContext = createContext<{
  sceneRef: React.RefObject<Three.Scene | null>
  cameraRef: React.RefObject<Three.PerspectiveCamera | null>
  rendererRef: React.RefObject<Three.WebGLRenderer | null>
  geometryRef: React.RefObject<Three.Mesh | null>
  modelOptionsRef: React.RefObject<modelOptions | null>
  orbitControlsRef: React.RefObject<OrbitControls | null>
  loadedFiles: React.RefObject<boolean>
  // toggleVisibility: () => void
  loadModelsIntoScene: () => void
} | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sceneRef = useRef<Three.Scene | null>(null)
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null)
  const rendererRef = useRef<Three.WebGLRenderer | null>(null)
  const geometryRef = useRef<Three.Mesh | null>(null)
  const modelOptionsRef = useRef<modelOptions | null>(null)
  const orbitControlsRef = useRef<OrbitControls | null>(null)
  const loadedFiles = useRef<boolean>(false)

  const loadModelsIntoScene = useCallback(() => {
    if (!modelOptionsRef.current) {
      console.error('modelsRef.current is not initialized or empty')
      return
    }

    // modelOptionsRef.current.forEach(optionVersion: partOptions => {
    //   optionVersion.forEach((option) => {
    //     if (option instanceof Three.Mesh) {
    //       sceneRef.current?.add(option)
    //     }
    //   })
    // })
    // the objects in modelOptionsRef.current should be objects matching the interface modelOptions
    // through all the nesting, we need to check if the values are of type Three.Object3D[]
    // for each items in those arrays, add them to the sceneRef.current

    if (modelOptionsRef.current) {
      Object.values(modelOptionsRef.current).forEach((optionVersion: partOptions) => {
        console.log('optionVersion: ', optionVersion)
        Object.values(optionVersion).forEach((option) => {
          console.log('option: ', option)
          if (option instanceof Three.Object3D) {
            sceneRef.current?.add(option)
          }
        })
      })
    }
    
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
      loadModelsIntoScene,
      // toggleVisibility
    }}>
      {children}
    </AppContext.Provider>
  )
}