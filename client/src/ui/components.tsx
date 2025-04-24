import { useCallback, useEffect, useRef } from 'react'
import { useThree } from '../hooks/three'
import * as Three from 'three'

export const Button = () => {
  const { geometryRef, sceneRef, modelOptionsRef } = useThree()

  const modelOneRef = useRef<Three.Object3D | null>(null)
  const modelTwoRef = useRef<Three.Object3D | null>(null)
  
  const loadModels = useCallback(() => {
    if (!modelOptionsRef.current) {
      console.error('modelsRef.current is not initialized or empty')
      return
    }

    // modelOneRef.current = modelOptionsRef.current[0]
    // modelTwoRef.current = modelOptionsRef.current[1]
    // modelTwoRef.current.visible = false

    // sceneRef.current?.add(modelOneRef.current)
    // sceneRef.current?.add(modelTwoRef.current)
  }, [])

  const toggleVisibility = useCallback(() => {
    if (!modelOneRef.current || !modelTwoRef.current) {
      console.error('Models not in the refs')
      return
    }
    modelOneRef.current.visible = !modelOneRef.current.visible
    modelTwoRef.current.visible = !modelTwoRef?.current.visible
  }, [])

  useEffect(() => {
    // have to wait for the contexts to get mounted
    if (geometryRef.current) {
      console.log('geometryRef.current is now: ', geometryRef.current)
    } else {
      console.log('geometryRef.current is not yet mounted')
    }
    if (!modelOptionsRef.current) {
      console.log('modelsRef.current is not yet mounted')
    } else {
      console.log('modelsRef.current is now: ', modelOptionsRef.current)
      loadModels()
    }
  }, [geometryRef, sceneRef, modelOptionsRef, loadModels])

  return (
    <button
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded`}
      onClick={toggleVisibility}
    >
      CLICK ME :)
    </button>
  )
}