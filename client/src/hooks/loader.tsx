import * as Three from 'three'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js'
import { useThree } from './three'
import { useCallback } from 'react'
// import materials from './materials'

// interface GeometryObject extends Three.Object3D {
//   geometry: Three.BufferGeometry
// }

export function useLoader() {

  const { sceneRef, cameraRef, orbitControlsRef, modelOptionsRef } = useThree()

  const loadFile = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (!sceneRef.current || !cameraRef.current || !orbitControlsRef.current) return

      const loader = new Rhino3dmLoader()
      loader.setLibraryPath('https://unpkg.com/rhino3dm@8.4.0/')

      const modelPaths = [
        '/assets/housing_button.3dm',
        '/assets/housing_standard.3dm',
        '/assets/casing_button.3dm',
        '/assets/casing_standard.3dm',
        '/assets/face_analogue1.3dm',
        '/assets/face_digital.3dm',
        '/assets/face_analogue2.3dm',
        '/assets/strap_cotton.3dm',
        '/assets/strap_rubber.3dm',
        // '/assets/complete_digital.3dm',
        // '/assets/complete_analogue_face1.3dm'
      ]

      const modelsRefHolder: modelOptions = modelOptionsRef.current || {}

      // 4 POSSIBLE MODEL PARTS:
      // * STRAP
      // * HOUSING TYPE
      // * CASING TYPE
      // * FACE TYPE

      // EXAMPLES FOR OPTIONS:
      // STRAP: RUBBER OR COTTON
      // FACE: ANALOGUE OR DIGITAL
      let loadedCount = 0

      modelPaths.forEach((path) => {
        // strip the path to get the name of the model as two words
        const modelName = path.split('/').pop()?.split('.')[0]
        const modelNameParts = modelName?.split('_')
        const part = modelNameParts![0]
        const option = modelNameParts![1]
        loader.load(
          path,
          (object: Three.Object3D) => {
            object.traverse((child) => {
              // console.log({child})
              const modelBitGroupName = child.name
              // if the child has no name, don't bother
              if (!modelBitGroupName) {
                console.log('child has no name - cannot use')
                return
              }

              if (modelsRefHolder === undefined) {
                console.log('something weird has happened - get out for now')
                return
              }
              // sanitise modelBitGroupName to remove quotes
              const sanitizedModelBitGroupName = modelBitGroupName.replace(/['"]+/g, '')

              // if the required objects are not already in place, set them up
              if (!modelsRefHolder[part]) {
                modelsRefHolder[part] = {}
              }
              if (!modelsRefHolder[part][option]) {
                modelsRefHolder[part][option] = {}
              }
              if (!modelsRefHolder[part][option][sanitizedModelBitGroupName]) {
                modelsRefHolder[part][option][sanitizedModelBitGroupName] = []
              }
              modelsRefHolder[part][option][sanitizedModelBitGroupName].push(child)
            })
  
            // finish up with the object
            object.scale.set(0.1, 0.1, 0.1)
            object.rotateX(-Math.PI / 2)

            loadedCount++
            if (loadedCount === modelPaths.length) {
              console.log('All models loaded')
              modelOptionsRef.current = modelsRefHolder
              resolve()
            }
          },
          (undefined),
          // (xhr: ProgressEvent) => {
          //   console.log((xhr.loaded / xhr.total * 100) + '% loaded')
          // },
          (error: unknown) => {
            console.error('An error happened: ', path, error)
            reject(error)
          }
        )
      })
    })
  }, [cameraRef, sceneRef, modelOptionsRef, orbitControlsRef])

return { loadFile, cameraRef, orbitControlsRef, sceneRef, modelOptionsRef }
}