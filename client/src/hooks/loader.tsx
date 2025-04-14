import * as Three from 'three'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js'
import { useThree } from './three'
import { useCallback } from 'react'

interface GeometryObject extends Three.Object3D {
  geometry: Three.BufferGeometry
}

export function useLoader() {

  const { sceneRef, cameraRef, orbitControlsRef, geometryRef, modelOptionsRef, loadedFiles } = useThree()

  const loadFile = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !orbitControlsRef.current) return
    if (loadedFiles.current) {
      console.log('files are already there')
      return
    }

    const loader = new Rhino3dmLoader()
    loader.setLibraryPath('https://unpkg.com/rhino3dm@8.4.0/')

    const modelPaths = [
      // '/assets/housing_button.3dm',
      // '/assets/housing_standard.3dm',
      // '/assets/casing_button.3dm',
      // '/assets/casing_standard.3dm',
      // '/assets/face_analogue_1.3dm',
      // '/assets/face_digital.3dm',
      // '/assets/face_analogue_2.3dm',
      // '/assets/strap_cotton.3dm',
      '/assets/strap_rubber.3dm',
      // '/assets/complete_digital.3dm',
      // '/assets/complete_analogue_face-1.3dm'
    ]

    const models: Three.Object3D[] = []

    for (let i = 0; i < modelPaths.length; i++) {
      // console.log('loading model: ', modelPaths[i])
      loader.load(
        modelPaths[i],
        (object: Three.Object3D) => {
            object.traverse((child) => {
              console.log({child})
              if (child.type && (child.type === 'Points' || child.type === 'Line')) {
                console.log('child is a point or line - not showing')
                child.parent?.remove(child)
                console.log('after removing child: ', child.parent)
                return
              }
              if (child instanceof Three.Mesh) {
                // if the child.name contains 'strap' or 'buckle',
              }
                if(child.name === 'face') {
                child.material = new Three.MeshStandardMaterial({
                  color: 0xff0000, // a shade of burgundy
                  side: Three.DoubleSide,
                })
              }
              // convert geometry to mesh
              if ((child as GeometryObject).geometry instanceof Three.BufferGeometry) {
                console.log('child is a buffer geometry')
                const mesh = new Three.Mesh((child as GeometryObject).geometry, new Three.MeshStandardMaterial({
                  color: 0x0000ff, // some shade of blue
                  side: Three.DoubleSide,
                  flatShading: true,
                }))
                // console.log('mesh: ', mesh)
                child = mesh
                // console.log('child is now a mesh: ', child)
              }
            }
          )
          object.scale.set(0.1, 0.1, 0.1)

          object.rotateX(-Math.PI / 2)
          object.position.x += i*5
          models.push(object)
          sceneRef.current?.add(object)

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

    modelOptionsRef.current = models

    const geometry = new Three.BoxGeometry()
    const material = new Three.MeshBasicMaterial({ color: 0x00ffff })
    const cube = new Three.Mesh(geometry, material)

    geometryRef.current = cube as Three.Mesh
    console.log('geometryRef.current is now: ', geometryRef.current)
    sceneRef.current?.add(cube)

    loadedFiles.current = true
    console.log('loadFileCalled is now: ', loadedFiles.current)
  }, [])

return { loadFile, sceneRef, cameraRef, orbitControlsRef, geometryRef, loadedFiles }
}