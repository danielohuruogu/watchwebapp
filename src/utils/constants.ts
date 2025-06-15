import * as Three from 'three'

const aspectRatio = 1.558

const sizes: { [key: string]: number | string } = {}

sizes.renderSceneWidth = 0.75 * window.innerWidth // for the renderer window
sizes.renderSceneHeight = 0.95 *window.innerHeight
sizes.sceneSize = 10000 // size for ground, sphere dome and camera far

const materials: { [key: string]: Three.MeshStandardMaterial | Three.MeshLambertMaterial | Three.ShaderMaterial } = {}

// materials for scene objects
materials['ground'] = new Three.MeshLambertMaterial({
  color: 0xffffff
})
materials['bulbLight'] = new Three.MeshStandardMaterial({
  color: 0xffffff, // white
  emissive: 0xffffff,
  emissiveIntensity: 1,
  roughness: 0.5,
  metalness: 0.5,
})
materials['skyDomeGradient'] = new Three.ShaderMaterial({
  side: Three.BackSide,
  uniforms: {
      FogColour: { value: new Three.Color(0xedf3fd) },
      LowerSkyColour: { value: new Three.Color(0x01426d) },
      LowMidSkyColour: { value: new Three.Color(0x003a63) },
      MidSkyColour: { value: new Three.Color(0x013155) },
      MidSkyColour2: { value: new Three.Color(0x002746) },
      TopSkyColor: { value: new Three.Color(0x001d37) },
      TopSkyColor2: { value: new Three.Color(0x01162e) },
      starMap: { value: new Three.TextureLoader().load('starmap_16k_d63.jpg') }, // starmap taken from here: https://github.com/PresidentKevvol/three.js-starry-sky/blob/master/index.js
      opacity: { value: 0 }
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
  fragmentShader: `
    uniform vec3 FogColour;
    uniform vec3 LowerSkyColour;
    uniform vec3 LowMidSkyColour;
    uniform vec3 MidSkyColour;
    uniform vec3 MidSkyColour2;
    uniform vec3 TopSkyColour;
    uniform vec3 TopSkyColour2;
    uniform sampler2D starMap;
    uniform float opacity;

    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      float height = clamp(vWorldPosition.y / ${sizes.sceneSize as number}.0, 0.0, 1.0);
      vec3 skyColour;

      if (height < 0.05) {
        skyColour = FogColour;
      } else if (height < 0.15) {
        float firstBlendFactor = smoothstep(0.05, 0.15, height);
        skyColour = mix(FogColour, LowerSkyColour, firstBlendFactor);
      } else if (height < 0.2) {
        float secondBlendFactor = smoothstep(0.2, 0.375, height);
        skyColour = mix(LowerSkyColour, LowMidSkyColour, secondBlendFactor);
      } else if (height < 0.4) {
        float thirdBlendFactor = smoothstep(0.4, 0.6, height);
        skyColour = mix(LowMidSkyColour, MidSkyColour, thirdBlendFactor);
      } else if (height < 0.6) {
        float fourthBlendFactor = smoothstep(0.6, 0.7, height);
        skyColour = mix(MidSkyColour, MidSkyColour2, fourthBlendFactor);
      } else if (height < 0.7) {
        float fifthBlendFactor = smoothstep(0.7, 0.8, height);
        skyColour = mix(MidSkyColour2, TopSkyColour, fifthBlendFactor);
      } else if (height < 0.8) {
        float sixthBlendFactor = smoothstep(0.8, 0.9, height);
        skyColour = mix(TopSkyColour, TopSkyColour2, sixthBlendFactor);
      }

      vec4 starTex = texture2D(starMap, vUv);
      vec3 finalColour = mix(skyColour, starTex.rgb, starTex.a);
      gl_FragColor = vec4(finalColour, opacity);
    }
  `,
  transparent: true,
  opacity: 0
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
      intensity: 300,
    },
  },
  rimLight1: {
    display: {
      intensity: 250,
    },
  },
  rimLight2: {
    display: {
      intensity: 100,
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
  aspectRatio,
  sizes,
  materials,
  colours,
  lights
}