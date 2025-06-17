import * as Three from 'three'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js'
import { useThree } from './three'
import { useCallback } from 'react'

const vercelEnv = import.meta.env.VITE_VERCEL_ENV

export function useLoader() {

  const { sceneRef, cameraRef, orbitControlsRef, modelOptionsRef } = useThree()

  const loadFile = useCallback((): CancellablePromise<void> => {
    let cancelled = false

    const promise = new Promise<void>((resolve, reject) => {
      if (!sceneRef.current || !cameraRef.current || !orbitControlsRef.current) return

      const loader = new Rhino3dmLoader()
      loader.setLibraryPath('https://unpkg.com/rhino3dm@8.4.0/')

      const paths = [
        '/assets/housing_button.3dm',
        '/assets/housing_standard.3dm',
        '/assets/casing_button.3dm',
        '/assets/casing_standard.3dm',
        '/assets/face_analogue1.3dm',
        '/assets/face_digital.3dm',
        '/assets/face_analogue2.3dm',
        '/assets/strap_cotton.3dm',
        '/assets/strap_rubber.3dm',
      ]

      const modelsRefHolder: models = modelOptionsRef.current || {}

      let loadedCount = 0

      const loadModels = async () => {
        for (const path of paths) {
          // strip the path to get the name of the model as two words
          let objectPath: string

          try {
            if (vercelEnv !== 'development') {
              const res = await fetch(`/api/presign?key=${encodeURIComponent(path)}`)
              const { url } = await res.json()
              objectPath = url
            } else {
              objectPath = path
            }

            const modelName = path.split('/').pop()?.split('.')[0]
            const modelNameParts = modelName?.split('_')
            const part = modelNameParts![0]
            const option = modelNameParts![1]
            loader.load(
              objectPath,
              (object: Three.Object3D) => {
                if (cancelled) return
                object.traverse((child) => {
                  const modelBitGroupName = child.name
                  // if the child has no name, don't bother
                  if (!modelBitGroupName) return
                  if (modelsRefHolder === undefined) return
                  
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
                  child.scale.set(0.1, 0.1, 0.1)
                  child.rotateX(-Math.PI / 2)
                  // clone the child material to avoid issues with shared materials
                  if ((child instanceof Three.Mesh || child instanceof Three.Line || child instanceof Three.LineSegments) && child.material) {
                    child.material = child.material.clone()
                    child.material.isShared = false
                  }
                  modelsRefHolder[part][option][sanitizedModelBitGroupName].push(child)
                })

                loadedCount++
                if (loadedCount === paths.length) {
                  console.log('All models loaded')
                  modelOptionsRef.current = modelsRefHolder
                  resolve()
                }
              },
              (undefined),
              (error: unknown) => {
                if (cancelled) return
                reject(error)
              }
            )
          } catch (err) {
            if (cancelled) return
            reject(err)
          }
        }
      }
      loadModels().catch(err => {
        if (!cancelled) reject(err)
      })
    }) as CancellablePromise<void>

    promise.cancel = () => { cancelled = true }

    return promise
  }, [cameraRef, sceneRef, modelOptionsRef, orbitControlsRef])

return { loadFile, cameraRef, orbitControlsRef, sceneRef, modelOptionsRef }
}