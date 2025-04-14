import * as Three from 'three'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js'
import { useThree } from './three'
import { useCallback } from 'react'
// import materials from './materials'

interface GeometryObject extends Three.Object3D {
  geometry: Three.BufferGeometry
}

export function useLoader() {

  const { sceneRef, cameraRef, orbitControlsRef, geometryRef, modelOptionsRef, loadedFiles } = useThree()

  const modelOptions = modelOptionsRef.current && modelOptionsRef.current
  console.log('modelOptions: ', modelOptions)

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
      // '/assets/face_analogue1.3dm',
      // '/assets/face_digital.3dm',
      // '/assets/face_analogue2.3dm',
      // '/assets/strap_cotton.3dm',
      '/assets/strap_rubber.3dm',
      // '/assets/complete_digital.3dm',
      // '/assets/complete_analogue_face1.3dm'
    ]

    // const models: Three.Object3D[] = []

    for (let i = 0; i < modelPaths.length; i++) {
      // console.log('loading model: ', modelPaths[i])
      // strip the path to get the name of the model as two words
      const modelName = modelPaths[i].split('/').pop()?.split('.')[0]
      console.log('modelName: ', modelName)
      const modelNameParts = modelName?.split('_')
      console.log('modelNameParts: ', modelNameParts)
      loader.load(
        modelPaths[i],
        (object: Three.Object3D) => {
            object.traverse((child) => {
              console.log({child})
              // if the child has no name, don't bother
              if (!child.name) return
              // if the modelOptions don't exist, don't bother for now
              if (!modelOptions) return

              // if modelOptions contains this part being loaded already, check if it has 
              if (Object.keys(modelOptions).includes(modelNameParts![0])) {
                // check the keys of that object if the type of model part is there
                const part = Object.keys(modelOptions[modelNameParts![0]])
                console.log('model options to be checked: ', part)
                // if this model option already has this part loaded, check if the child already exists
                if (part.includes(modelNameParts![1])) {
                  console.log('modelOptions already contains this option')
                  // if the child already exists in the the array, return. if it doesn't, add it
                  const existingChildren = modelOptions[modelNameParts![0]][modelNameParts![1]]
                  console.log('existingChildren: ', existingChildren)
                  if (existingChildren.includes(child)) return
                  console.log('modelOptions does not contain this option, adding it')
                  modelOptions[modelNameParts![0]][modelNameParts![1]] = [...existingChildren, child]
                } else {
                  // going to need to create an object, with a key being the child name and value being an array of the children with that name
                  modelOptions[modelNameParts![0]][modelNameParts![1]] = [child]
                }
              } else {
                // if the modelOptions doesn't contain this part, create it
                modelOptions[modelNameParts![0]] = {
                  [modelNameParts![1]]: [child]
                }
              }


              // if (child.type && (child.type === 'Points' || child.type === 'Line')) {
              //   // console.log('child is a point or line - not showing')
              //   // child.parent?.remove(child)
              //   // console.log('after removing child: ', child.parent)
              //   return
              // }
              // if (child instanceof Three.Mesh) {
              //   // if the child.name contains 'strap' or 'buckle',
              // }
              // // convert geometry to mesh
              // if ((child as GeometryObject).geometry instanceof Three.BufferGeometry) {
              //   console.log('child is a buffer geometry')
              //   const mesh = new Three.Mesh((child as GeometryObject).geometry, new Three.MeshStandardMaterial({
              //     color: 0x0000ff, // some shade of blue
              //     side: Three.DoubleSide,
              //     flatShading: true,
              //   }))
              //   // console.log('mesh: ', mesh)
              //   child = mesh
              //   // console.log('child is now a mesh: ', child)
              // }
            }
          )
          object.scale.set(0.1, 0.1, 0.1)

          object.rotateX(-Math.PI / 2)
          object.position.x += i*5
          // models.push(object)
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

    // modelOptionsRef.current = models

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