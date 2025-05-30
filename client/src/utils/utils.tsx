import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const AppContext = createContext<{
  sceneRef: React.RefObject<Three.Scene | null>
  cameraRef: React.RefObject<Three.PerspectiveCamera | null>
  hemisphericLightRef: React.RefObject<Three.HemisphereLight | null>
  bulbLightRef: React.RefObject<Three.PointLight | null>
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
  loadModelsIntoScene: () => void
  autoRotate: boolean
  setAutoRotate: React.Dispatch<React.SetStateAction<boolean>>
  displayLights: boolean
  setDisplayLights: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // refs for the scene
  const sceneRef = useRef<Three.Scene | null>(null)
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null)
  const hemisphericLightRef = useRef<Three.HemisphereLight | null>(null)
  const bulbLightRef = useRef<Three.PointLight | null>(null)
  const displayLightsRef = useRef<Three.Group | null>(null)
  const rendererRef = useRef<Three.WebGLRenderer | null>(null)
  const orbitControlsRef = useRef<OrbitControls | null>(null)

  // refs + containers for the models
  const modelOptionsRef = useRef<models>({})
  const displayedSelectionRef = useRef<models>({})
  const modelSizeRef = useRef<number | null>(null)
  const defaultModelRef = useRef<defaultConfigDigital | defaultConfigAnalogue>({})

  // states for loading states
  const [loadedFiles, setLoadedFiles] = useState<boolean>(false)
  const [refsInitialised, setRefsInitialised] = useState<boolean>(false)

  // states for display options
  const [autoRotate, setAutoRotate] = useState<boolean>(false)
  const [displayLights, setDisplayLights] = useState<boolean>(false)

  // check to make sure refs are initialised first
  useEffect(() => {
    // console.log('sceneRef: ', sceneRef.current)
    // console.log('cameraRef: ', cameraRef.current)
    // console.log('cameraOrthographicRef: ', cameraOrthographicRef.current)
    // console.log('cameraPerspectiveRef: ', cameraPerspectiveRef.current)
    // console.log('cameraRigRef: ', cameraRigRef.current)
    // console.log('activeCameraRef: ', activeCameraRef.current)
    // console.log('atmosphericLightRef: ', hemisphericLightRef.current)
    // console.log('bulbLightRef: ', bulbLightRef.current)
    // console.log('rendererRef: ', rendererRef.current)
    // console.log('orbitControlsRef: ', orbitControlsRef.current)
    // console.log('modelOptionsRef: ', modelOptionsRef.current)
    // console.log('displayedSelectionRef: ', displayedSelectionRef.current)
    // console.log('defaultModelRef: ', defaultModelRef.current)
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
      // cameraOrthographicRef,
      // cameraPerspectiveRef,
      // cameraRigRef,
      // hemisphericLightRef,
      // bulbLightRef,
      rendererRef,
      orbitControlsRef,
      modelOptionsRef,
      displayedSelectionRef,
      defaultModelRef
    ])

  const loadModelsIntoScene = useCallback(() => {
    if (!refsInitialised) {
      console.error('Refs are not yet initialised')
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
      defaultModelRef.current = digitalConfig
    } else {
      defaultModelRef.current = analogueConfig
    }

    // go through the current and add them to the scene
    Object.entries(defaultModelRef.current).forEach(([partType, option]) => { // example would be strap, cotton
      const selectedModelPart = modelOptionsRef.current![partType][option]
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
      sceneRef,
      cameraRef,
      hemisphericLightRef,
      bulbLightRef,
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
      loadModelsIntoScene,
      autoRotate,
      setAutoRotate,
      displayLights,
      setDisplayLights
    }}>
      {children}
    </AppContext.Provider>
  )
}