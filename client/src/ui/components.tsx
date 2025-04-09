import { useCallback, useEffect, useRef } from 'react'
import { useThree } from '../hooks/three'
import * as Three from 'three'

export const Button = () => {
  const { geometryRef, sceneRef, modelsRef } = useThree()

  const modelOneRef = useRef<Three.Object3D | null>(null);
  const modelTwoRef = useRef<Three.Object3D | null>(null);
  
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

  const toggleVisibility = () => {
    if (!modelOneRef.current || !modelTwoRef.current) {
      console.error('Models not loaded yet')
      return
    }
    modelOneRef.current.visible = !modelOneRef.current.visible
    modelTwoRef.current.visible = !modelTwoRef?.current.visible
  }

  useEffect(() => {
    // have to wait for the contexts to get mounted
    if (geometryRef.current) {
      console.log('geometryRef.current is now: ', geometryRef.current)
    } else {
      console.log('geometryRef.current is not yet mounted')
    }
    if (!modelsRef.current) {
      console.log('modelsRef.current is not yet mounted')
    } else {
      console.log('modelsRef.current is now: ', modelsRef.current)
      loadModels()
    }
  }, [geometryRef, sceneRef, modelsRef, loadModels])

  return (
    <button
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded`}
      onClick={toggleVisibility}
    >
      CLICK ME :)
    </button>
  )
}