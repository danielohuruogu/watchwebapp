import React, { createContext, useCallback, useRef, useState } from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const AppContext = createContext<{
  sceneRef: React.RefObject<Three.Scene | null>
  cameraRef: React.RefObject<Three.PerspectiveCamera | null>
  rendererRef: React.RefObject<Three.WebGLRenderer | null>
  modelOptionsRef: React.RefObject<modelOptions | null>
  defaultModelRef: React.RefObject<defaultConfigDigital | defaultConfigAnalogue | null>
  currentSelectionRef: React.RefObject<currentSelection | null>
  orbitControlsRef: React.RefObject<OrbitControls | null>
  loadedFiles: boolean
  setLoadedFiles: React.Dispatch<React.SetStateAction<boolean>>
  loadModelsIntoScene: () => void
} | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // refs for the scene
  const sceneRef = useRef<Three.Scene | null>(null)
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null)
  const rendererRef = useRef<Three.WebGLRenderer | null>(null)
  const orbitControlsRef = useRef<OrbitControls | null>(null)

  // refs + containers for the models
  const modelOptionsRef = useRef<modelOptions | null>(null)
  const currentSelectionRef = useRef<currentSelection | null>(null)
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
      housing: 'button',
      casing: 'button',
      strap: 'cotton',
      face: 'digital'
    }

    const analogueConfig: defaultConfigAnalogue = {
      housing: 'standard',
      casing: 'standard',
      strap: 'rubber',
      face: Math.random() > 0.5 ? 'analogue1' : 'analogue2'
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
      Object.entries(defaultModelRef.current).forEach(([partType, option]) => { // example would be strap, cotton
        // find the equivalent part in the modelOptionsRef.current
        // find the children and add it to the scene
        const selectedModelPart = modelOptionsRef.current![partType][option]
        if (!selectedModelPart) {
          console.error(`No model part found for ${selectedModelPart}`)
          return
        }
        // modelPart could be cotton strap - add all the children to the scene
        Object.values(selectedModelPart).forEach((group) => {
          group.forEach((child) => {
            if (sceneRef.current) {
              sceneRef.current.add(child)
            } else {
              console.error('sceneRef.current is not yet initialized')
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
      defaultModelRef,
      currentSelectionRef,
      orbitControlsRef,
      loadedFiles,
      setLoadedFiles,
      loadModelsIntoScene,
    }}>
      {children}
    </AppContext.Provider>
  )
}