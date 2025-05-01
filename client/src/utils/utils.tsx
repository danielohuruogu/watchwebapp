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
    console.log('the current sceneRef is: ' ,sceneRef.current)
    if (defaultModelRef.current) {
      console.log('defaultModelRef.current: ', defaultModelRef.current)
      // go through the current and add them to the scene
      Object.keys(defaultModelRef.current).forEach((part) => { // example would be strap
        console.log('part: ', part)
        Object.keys(defaultModelRef.current![part]).forEach((type) => { // example would be cotton
          console.log('type: ', type)
          Object.keys(defaultModelRef.current![part][type]).forEach((modelBitGroupName) => { // example would be buckle
            console.log('modelBitGroupName: ', modelBitGroupName)
            // the value should be an array of Three.Object3D objects. add these to the scene
            const modelBitGroup = defaultModelRef.current![part][type][modelBitGroupName]
            console.log('modelBitGroup: ', modelBitGroup)
            if (!modelBitGroup) {
              console.error(`Model group ${modelBitGroupName} not found`)
              return
            }
            try {
              modelBitGroup.forEach((modelBit) => {
                console.log('modelBit: ', modelBit)
                console.log('adding bit to scene')
                sceneRef.current?.add(modelBit)
              })
            } catch (error) {
              console.error('Error adding model bit group to scene: ', error)
            }
          })
        })
      })
      console.log('models added to scene')
      console.log(sceneRef.current?.children)
    }
  }, [modelOptionsRef, sceneRef, defaultModelRef])

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
    }}>
      {children}
    </AppContext.Provider>
  )
}