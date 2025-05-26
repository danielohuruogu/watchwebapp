import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const ToggleDisplay = (orbitControls: OrbitControls, setDisplayToggle: React.Dispatch<React.SetStateAction<boolean>>) => {
  // at the click of a button, 'Display Mode' will be activated

  // will reset the orbit controls and enable damping
  // will also toggle the visibility of the config, so that only the model and the toggle button is shown

  setDisplayToggle((prevToggle) => {
    if (prevToggle) { // if the display is currently toggled on, we want to toggle it off and revert the orbit controls
      orbitControls.autoRotate = false
    } else { // if the display toggle is off, we want to enable the auto-rotate and damping
      orbitControls.autoRotate = true
    }
    const newToggle = !prevToggle // toggle the display toggle state

  
    // toggle the classname for the config container
    const configContainer = document.querySelector('.config-container')
    if (configContainer) {
      configContainer.classList.toggle('hidden', newToggle)
    }
    return newToggle // return the new toggle state
  }) // toggle the display toggle state

  // will need to rearrange the page so that the watch becomes centred on it when the config disappears
}

export default ToggleDisplay