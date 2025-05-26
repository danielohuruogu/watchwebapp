import * as Three from 'three'
// import { useThree } from '../hooks/three'

/*
* function to toggle the visibility of the model options
*
* @param <Three.Scene> sceneRef - reference to the Three.js scene
* @param <models> modelOptionsRef - reference to the model options
* @param <models> currentSelectionRef - reference to the current selection
* */
export const toggleVisibility = (scene: Three.Scene, currentSelectionContainer: models) => {
  // whatever is in the current selection, set the visibility of the model options to false
  // go through the scene and remove all model children

  // const { modelSizeRef } = useThree()

  if (!currentSelectionContainer) {
    console.error('currentSelectionRef.current is not set')
    return
  }

  if (!scene) {
    console.error('sceneRef.current is not set')
    return
  }

  // remove all the children from the scene
  const childrenToRemove: Three.Object3D[] = []
  scene.traverse((child: Three.Object3D) => {
    // check if the child is a mesh
    if (child.isObject3D && child.type === 'Mesh') {
      const mesh = child as Three.Mesh
      if (mesh.geometry && (mesh.geometry.type !== 'PlaneGeometry' && mesh.geometry.type !== 'SphereGeometry')) {
      childrenToRemove.push(child)
      }
    }
  })

  childrenToRemove.forEach((child) => {
    scene.remove(child)
  })

  // go through the current selection and add the children to the scene
  Object.entries(currentSelectionContainer).forEach(([partType, option]) => { // example would be strap, cotton
    const optionName = Object.keys(option)[0]
    const selectedModelPart = currentSelectionContainer[partType][optionName]
    if (!selectedModelPart) {
      console.error(`No model part found for ${selectedModelPart}`)
      return
    }
    // modelPart could be cotton strap - add all the children to the scene
    Object.values(selectedModelPart).forEach((group) => {
      if (!scene) {
        console.error('sceneRef.current is not set')
        return
      }
      group.forEach((child) => {
        child.castShadow = true
        scene.add(child)
      })
    })
  })
}