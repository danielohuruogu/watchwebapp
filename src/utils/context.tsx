import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const AppContext = createContext<{
  loaderRef: React.RefObject<Three.LoadingManager>
  sceneRef: React.RefObject<Three.Scene | null>
  cameraRef: React.RefObject<Three.PerspectiveCamera | null>
  skyRef: React.RefObject<Three.Mesh | null>
  standardLightsRef: React.RefObject<Three.Group | null>
  displayLightsRef: React.RefObject<Three.Group | null>
  rendererRef: React.RefObject<Three.WebGLRenderer | null>
  modelOptionsRef: React.RefObject<models>
  defaultModelRef: React.RefObject<defaultConfigDigital | defaultConfigAnalogue>
  displayedSelectionRef: React.RefObject<models>
  modelSizeRef: React.RefObject<number| null>
  orbitControlsRef: React.RefObject<OrbitControls | null>
  refsInitialised: boolean
  loadedFiles: boolean
  setLoadedFiles: React.Dispatch<React.SetStateAction<boolean>>
  setInitialModels: () => void
  autoRotate: boolean
  setAutoRotate: React.Dispatch<React.SetStateAction<boolean>>
  displayLights: boolean
  setDisplayLights: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ref for the loader
  const loaderRef = useRef<Three.LoadingManager>(new Three.LoadingManager())

  // refs for the scene
  const sceneRef = useRef<Three.Scene | null>(null)
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null)
  const skyRef = useRef<Three.Mesh | null>(null)
  const standardLightsRef = useRef<Three.Group | null>(null)
  const displayLightsRef = useRef<Three.Group | null>(null)
  const rendererRef = useRef<Three.WebGLRenderer | null>(null)
  const orbitControlsRef = useRef<OrbitControls | null>(null)

  // refs + containers for the models
  const modelOptionsRef = useRef<models>({})
  const displayedSelectionRef = useRef<models>({})
  const modelSizeRef = useRef<number | null>(null)

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

  // setting a default to begin with
  const defaultModelRef = useRef<defaultConfigDigital | defaultConfigAnalogue>(
    Math.random() > 0.5 ? digitalConfig : analogueConfig
  )

  // states for loading states
  const [loadedFiles, setLoadedFiles] = useState<boolean>(false)
  const [refsInitialised, setRefsInitialised] = useState<boolean>(false)

  // states for display options
  const [autoRotate, setAutoRotate] = useState<boolean>(false)
  const [displayLights, setDisplayLights] = useState<boolean>(false)

  // check to make sure refs are initialised first
  useEffect(() => {
    if (
      sceneRef.current &&
      cameraRef.current &&
      rendererRef.current &&
      orbitControlsRef.current &&
      modelOptionsRef.current &&
      displayedSelectionRef.current &&
      defaultModelRef.current
    ) {
      setRefsInitialised(true)
    } else {
      setRefsInitialised(false)
    }
  }, [sceneRef,
      cameraRef,
      rendererRef,
      orbitControlsRef,
      modelOptionsRef,
      displayedSelectionRef,
      defaultModelRef
    ])

  const setInitialModels = useCallback(() => {
    if (!refsInitialised) {
      console.warn('Refs are not yet initialised')
      return
    }

    // go through the current and add them to the scene
    Object.entries(defaultModelRef.current).forEach(([partType, option]) => { // example would be strap, cotton
      const partTypeInModelRef = modelOptionsRef.current?.[partType]
      if (!partTypeInModelRef) {
        console.warn(`No model options found for ${partType} in modelOptionsRef.current`)
        return
      }
      const selectedModelPart = modelOptionsRef.current?.[partType]?.[option]
      if (!selectedModelPart) return

      // add the current selection to the displayedSelectionRef, for later use
      displayedSelectionRef.current = {
        ...displayedSelectionRef.current,
        [partType]: {
          ...(displayedSelectionRef.current?.[partType] || {}),
          [option]: selectedModelPart
        }
      }
    })
  }, [refsInitialised, modelOptionsRef, sceneRef, defaultModelRef, displayedSelectionRef])

  return (
    <AppContext.Provider value={{
      loaderRef,
      sceneRef,
      cameraRef,
      skyRef,
      standardLightsRef,
      displayLightsRef,
      rendererRef,
      modelOptionsRef,
      defaultModelRef,
      displayedSelectionRef,
      modelSizeRef,
      orbitControlsRef,
      refsInitialised,
      loadedFiles,
      setLoadedFiles,
      setInitialModels,
      autoRotate,
      setAutoRotate,
      displayLights,
      setDisplayLights
    }}>
      {children}
    </AppContext.Provider>
  )
}