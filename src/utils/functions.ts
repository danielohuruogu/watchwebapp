import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

const downloadScreenshot = (renderer: Three.WebGLRenderer, scene: Three.Scene, camera: Three.PerspectiveCamera, orbitControls: OrbitControls): void => {
  if (!renderer || !scene || !camera || !orbitControls) {
    console.error('Renderer, scene, camera, or orbitControls is not initialized. Cannot download file.')
    return
  }

  renderer.render(scene, camera)

  // Create a new canvas for capturing the image
  const captureCanvas = document.createElement("canvas")
  captureCanvas.width = renderer.domElement.width
  captureCanvas.height = renderer.domElement.height
  const context = captureCanvas.getContext("2d")
  // Draw the WebGL canvas to our capture canvas
  context?.drawImage(renderer.domElement, 0, 0)

  // Convert the canvas to a data URL (PNG format with transparency)
  // Using maximum quality (1.0)
  const dataURL = captureCanvas.toDataURL("image/png", 1.0)

  // Create a temporary anchor element to trigger the download
  const link = document.createElement("a")
  link.href = dataURL
  link.download = "model.png"

  // Append to body, click to download, then remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/*
* function to toggle the visibility of the model options
*
* @param <Three.Scene> sceneRef - reference to the Three.js scene
* @param <models> modelOptionsRef - reference to the model options
* @param <models> currentSelectionRef - reference to the current selection
* */
const toggleVisibility = (scene: Three.Scene, currentSelectionContainer: models) => {
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
  const childrenToRemove: Three.Object3D[] = []
  scene.traverse((child: Three.Object3D) => {
    // check if the child is a mesh
    if (child.isObject3D && (child.type === 'Mesh' || child.type === 'Line' || child.type === 'LineSegments')) {
      const mesh = child as Three.Mesh | Three.Line
      if (mesh.geometry && (mesh.geometry.type !== 'PlaneGeometry' && mesh.geometry.type !== 'SphereGeometry')) {
      childrenToRemove.push(child)
      }
    }
  })

  childrenToRemove.forEach((child) => {
    scene.remove(child)
  })

  // go through the current selection and add the children to the scene
  if (!currentSelectionContainer || Object.keys(currentSelectionContainer).length === 0) {
    console.error('currentSelectionRef.current is not set')
    return false
  }
  Object.entries(currentSelectionContainer).forEach(([partType, option]) => { // example would be strap, cotton
    const optionName = Object.keys(option)[0]
    const selectedPartType = currentSelectionContainer[partType]
    if (!selectedPartType) {
      console.error(`No model part found for ${selectedPartType}`)
      return false
    }
    const selectedModelPart = currentSelectionContainer[partType][optionName]
    if (!selectedModelPart) {
      console.error(`No model part found for ${selectedModelPart}`)
      return false
    }
    // modelPart could be cotton strap - add all the children to the scene
    Object.values(selectedModelPart).forEach((group) => {
      if (!scene) {
        console.error('sceneRef.current is not set')
        return false
      }
      group.forEach((child) => {
        child.castShadow = true
        scene.add(child)
      })
    })
  })
  return true
}

const resetCamera = (orbitControls: OrbitControls, camera: Three.PerspectiveCamera): void => {
  gsap.to(camera.position, {
    duration: 0.5,
    x: -5,
    y: 5,
    z: 8,
    onUpdate: () => {
      camera.updateProjectionMatrix()
      camera.lookAt(0, 0, 0)
      orbitControls.update()
    }
  })
}

const formatOptionName = (optionName: string): string => {
  // capitalise the first letter
  let formattedName
  formattedName = optionName.charAt(0).toUpperCase() + optionName.slice(1)

  // if it matches the Regex pattern for a word and number e.g. Analogue1, seperate with a space
  if (formattedName.match(/^[A-Za-z]+[0-9]+$/)) formattedName = formattedName.replace(/([a-zA-Z])(\d)/g, '$1 $2')
  
  return formattedName
}

export {
  downloadScreenshot,
  toggleVisibility,
  resetCamera,
  formatOptionName
}