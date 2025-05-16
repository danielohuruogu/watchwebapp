import * as Three from 'three'

/*
* function to toggle the visibility of the model options
*
* @param <Three.Scene> sceneRef - reference to the Three.js scene
* @param <models> modelOptionsRef - reference to the model options
* @param <models> currentSelectionRef - reference to the current selection
* */
export const toggleVisibility = (scene: Three.Scene, currentSelectionContainer: models) => {
  console.log('toggling visibility')
  console.log(currentSelectionContainer)
  console.log(scene)

  // whatever is in the current selection, set the visibility of the model options to false
  // go through the scene and remove all model children

  if (!currentSelectionContainer) {
    console.error('currentSelectionRef.current is not set')
    return
  }

  if (!scene) {
    console.error('sceneRef.current is not set')
    return
  }

  // remove all the children from the scene
  scene.traverse((child) => {
    scene.remove(child)
    console.log('removing child: ', child)
  })

  // go through the current selection and add the children to the scene
  const partsOfWatch = Object.keys(currentSelectionContainer) // should be ['face', 'housing', 'strap', 'casing']
  Object.entries(partsOfWatch).forEach(([partType, option]) => { // example would be strap, cotton
    console.log('partType: ', partType)
    console.log('option: ', option)
    const selectedModelPart = currentSelectionContainer[partType][option]
    console.log('selectedModelPart: ', selectedModelPart)
    if (!selectedModelPart) {
      console.error(`No model part found for ${selectedModelPart}`)
      return
    }
    // modelPart could be cotton strap - add all the children to the scene
    Object.values(selectedModelPart).forEach((group) => {
      console.log('group: ', group)
      if (!scene) {
        console.error('sceneRef.current is not set')
        return
      }
      group.forEach((child) => {
        scene.add(child)
      })
    })
    console.log('models added to scene')
  })
}