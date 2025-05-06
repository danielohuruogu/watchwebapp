import { useThree } from '../hooks/three'

export function ToggleVisibility() {
  const { sceneRef, currentSelectionRef, modelOptionsRef } = useThree()
  console.log('toggling visibility')
  console.log(currentSelectionRef.current)
  console.log(modelOptionsRef.current)
  console.log(sceneRef.current)

  // whatever is in the current selection, set the visibility of the model options to false
  // go through the scene and remove all model children

  // remove all the children from the scene
  if (sceneRef.current) {
    sceneRef.current.traverse((child) => {
      sceneRef.current?.remove(child)
      console.log('removing child: ', child)
    })
  }

  if (!modelOptionsRef.current) {
    console.error('modelOptionsRef.current is not set')
    return
  }
  if (!currentSelectionRef.current) {
    console.error('currentSelectionRef.current is not set')
    return
  }
  // go through the current selection and add the children to the scene
  const currentSelection = currentSelectionRef.current
  const modelOptions = modelOptionsRef.current
  const partsOfWatch = Object.keys(currentSelection) // should be ['face', 'housing', 'strap', 'casing']
  Object.entries(partsOfWatch).forEach(([partType, option]) => { // example would be strap, cotton
    console.log('partType: ', partType)
    console.log('option: ', option)
    console.log('modelOptions[partType]: ', modelOptions[partType])
    const selectedModelPart = modelOptions[partType][option]
    console.log('selectedModelPart: ', selectedModelPart)
    if (!selectedModelPart) {
      console.error(`No model part found for ${selectedModelPart}`)
      return
    }
    // modelPart could be cotton strap - add all the children to the scene
    Object.values(selectedModelPart).forEach((group) => {
      console.log('group: ', group)
      group.forEach((child) => {
        if (sceneRef.current) {
          sceneRef.current.add(child)
        } else {
          console.error('sceneRef.current is not yet initialized')
        }
      })
    })
    console.log('models added to scene')
  })
}