import React, { createContext, useCallback, useRef, useState } from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const AppContext = createContext<{
  sceneRef: React.RefObject<Three.Scene | null>
  cameraRef: React.RefObject<Three.PerspectiveCamera | null>
  rendererRef: React.RefObject<Three.WebGLRenderer | null>
  geometryRef: React.RefObject<Three.Mesh | null>
  modelOptionsRef: React.RefObject<modelOptions | null>
  orbitControlsRef: React.RefObject<OrbitControls | null>
  loadedFiles: boolean
  setLoadedFiles: React.Dispatch<React.SetStateAction<boolean>>
  // toggleVisibility: () => void
  loadModelsIntoScene: () => void
} | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // refs for the scene
  const sceneRef = useRef<Three.Scene | null>(null)
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null)
  const rendererRef = useRef<Three.WebGLRenderer | null>(null)
  const geometryRef = useRef<Three.Mesh | null>(null)
  const orbitControlsRef = useRef<OrbitControls | null>(null)

  // refs for the models
  const modelOptionsRef = useRef<modelOptions | null>(null)
  const defaultModelRef = useRef<defaultConfigDigital | defaultConfigAnalogue | null>(null)

  // state for loadedFile
  const [loadedFiles, setLoadedFiles] = useState<boolean>(false)

  const loadModelsIntoScene = useCallback(() => {
    if (!modelOptionsRef.current) {
      console.error('modelsRef.current is not initialized or empty')
      return
    }

    // to begin with I want to select the model options that correspond to one of the default configs outlined
    const digitalConfig: defaultConfigDigital = {
      housing: {
        button: modelOptionsRef.current?.housing.button || {}
      },
      casing: {
        button: modelOptionsRef.current?.casing.button || {}
      },
      strap: {
        cotton: modelOptionsRef.current?.strap.cotton || {}
      },
      face: {
        digital: modelOptionsRef.current?.face.digital || {}
      }
    }

    const analogueConfig: defaultConfigAnalogue = {
      housing: {
        standard: modelOptionsRef.current?.housing.standard || {}
      },
      casing: {
        standard: modelOptionsRef.current?.casing.standard || {}
      },
      strap: {
        rubber: modelOptionsRef.current?.strap.rubber || {}
      },
      face: {
        analogue1: modelOptionsRef.current?.face.analogue1 || {}
      }
    }
    
    // just to see how one gets chosen to begin with
    if (Math.random() > 0.5) {
      console.log('choosing digital config: ', digitalConfig)
      defaultModelRef.current = digitalConfig
    } else {
      console.log('choosing analogue config: ', analogueConfig)
      defaultModelRef.current = analogueConfig
    }

    // need to properly load in the models here
    if (defaultModelRef.current) {
      Object.values(defaultModelRef.current).forEach((optionVersion: partOptions) => {
        console.log('optionVersion: ', optionVersion)
        Object.values(optionVersion).forEach((option) => {
          console.log('option: ', option)
          if (option instanceof Three.Object3D) {
            console.log('adding option to scene ')
            sceneRef.current?.add(option)
          } else {
            console.log('checking what is going on')
          }
        })
      })
    }
    
  }, [modelOptionsRef, defaultModelRef])

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
      setLoadedFiles,
      loadModelsIntoScene,
      // toggleVisibility
    }}>
      {children}
    </AppContext.Provider>
  )
}