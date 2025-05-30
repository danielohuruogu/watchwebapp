import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function downloadScreenshot(renderer: Three.WebGLRenderer, scene: Three.Scene, camera: Three.PerspectiveCamera, orbitControls: OrbitControls): void {
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