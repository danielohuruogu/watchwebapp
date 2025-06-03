import * as Three from 'three'

const sizes: { [key: string]: number | string } = {}

sizes.sceneWidth = 0.75 * window.innerWidth
sizes.sceneHeight = window.innerHeight

const materials: { [key: string]: Three.MeshPhysicalMaterial | Three.MeshStandardMaterial | Three.MeshLambertMaterial | Three.ShadowMaterial} = {}

// materials for scene objects
materials['ground'] = new Three.ShadowMaterial({
  opacity: 0.01
})
materials['bulbLight'] = new Three.MeshStandardMaterial({
  color: 0xffffff, // white
  emissive: 0xffffff,
  emissiveIntensity: 1,
  roughness: 0.5,
  metalness: 0.5,
})
// colour properties

const rgbToThreeColour = (r: number, g: number, b: number): Three.Color => {
  return new Three.Color(r / 255, g / 255, b / 255)
}

const colours = {
  background: {
    standard: rgbToThreeColour(245, 245, 245), // off-white background
    display: rgbToThreeColour(0, 2, 20)
  }
}

// light properties
const lights: {
  [key: string] : {
      display?: {
        [key: string]: number | string | Three.ColorRepresentation
      },
      standard?: {
        [key: string]: number | string | Three.ColorRepresentation
      }
}} = {
  ambientLight: {
    display: {
      intensity: 0.05,
    },
    standard: {
      intensity: 1.5,
    }
  },
  topLight: {
    standard: {
      intensity: 5,
    }
  },
  frontLight: {
    standard: {
      intensity: 12,
    }
  },
  sideLight: {
    standard: {
      intensity: 10,
    }
  },
  backlights: {
    display: {
      color: 0x9ecfff, // white
      intensity: 0.5,
    },
    standard: {
      color: 0x9ecfff, // white
      intensity: 0.3,
    }
  },
  keyLight: {
    display: {
      intensity: 1500,
    },
  },
  rimLight1: {
    display: {
      intensity: 350,
    },
  },
  rimLight2: {
    display: {
      intensity: 200,
    },
  },
  backlight: {
    display: {
      color: 0x9ecfff,
      intensity: 450,
    }
  }
}

export {
  sizes,
  materials,
  colours,
  lights
}