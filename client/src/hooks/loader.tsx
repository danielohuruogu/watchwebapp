import * as Three from 'three'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js'
import { useThree } from './three'
import { useCallback } from 'react'

interface GeometryObject extends Three.Object3D {
  geometry: Three.BufferGeometry
}

export function useLoader() {

  const { sceneRef, cameraRef, orbitControlsRef, geometryRef, modelsRef, loadFileCalled } = useThree()

  const loadFile = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !orbitControlsRef.current) return
    if (loadFileCalled.current) {
      console.log('loadFile already called')
      return
    }

    const loader = new Rhino3dmLoader()
    loader.setLibraryPath('https://unpkg.com/rhino3dm@8.4.0/')

    const modelPaths = [
      // '/assets/housing_button.3dm',
      // '/assets/housing_standard.3dm',
      '/assets/complete_digital.3dm',
      '/assets/complete_analogue_face-1.3dm'
    ]

    const models: Three.Object3D[] = []

    for (let i = 0; i < modelPaths.length; i++) {
      // console.log('loading model: ', modelPaths[i])
      loader.load(
        modelPaths[i],
        (object: Three.Object3D) => {
            object.traverse((child) => {
              // console.log({child})
              if (child instanceof Three.Mesh) {
                // console.log('child is a mesh')
                child.material = new Three.MeshStandardMaterial({
                  color: 0x00ff00,
                  side: Three.DoubleSide,
                })
                child.scale.set(0.1, 0.1, 0.1)
              } else {
                // convert geometry to mesh
                if ((child as GeometryObject).geometry instanceof Three.BufferGeometry) {
                  // console.log('child is a buffer geometry')
                  const mesh = new Three.Mesh((child as GeometryObject).geometry, new Three.MeshStandardMaterial({
                    color: 0x00ff00,
                    side: Three.DoubleSide,
                    flatShading: true,
                  }))
                  mesh.scale.set(0.1, 0.1, 0.1)
                  child = mesh
                } else {
                  console.log('child is not a mesh or buffer geometry: ', child)
                }
              }
            }
          )
          object.rotateX(-Math.PI / 2)
          // object.position.x += i*5
          models.push(object)
          // sceneRef.current?.add(object)

          console.log('loaded object: ', object)
        },
        (undefined),
        // (xhr: ProgressEvent) => {
        //   // console.log((xhr.loaded / xhr.total * 100) + '% loaded')
        // },
        (error: unknown) => {
          console.error('An error happened: ', error)
        }
      )
    }

    modelsRef.current = models

    const geometry = new Three.BoxGeometry()
    const material = new Three.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new Three.Mesh(geometry, material)

    geometryRef.current = cube as Three.Mesh
    console.log('geometryRef.current is now: ', geometryRef.current)
    sceneRef.current?.add(cube)

    loadFileCalled.current = true
    console.log('loadFileCalled is now: ', loadFileCalled.current)
  }, [])

return { loadFile, sceneRef, cameraRef, orbitControlsRef, geometryRef, loadFileCalled }
}