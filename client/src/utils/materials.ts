import * as Three from 'three'

const materials: { [key: string]: Three.MeshPhysicalMaterial | Three.MeshStandardMaterial | Three.MeshLambertMaterial} = {}

// materials for scene objects
materials['ground'] = new Three.MeshLambertMaterial({
  color: 0xffffff, // grey
  side: Three.DoubleSide,
})
materials['bulbLight'] = new Three.MeshStandardMaterial({
  color: 0xffffff, // white
  emissive: 0xffffff,
  emissiveIntensity: 1,
  roughness: 0.5,
  metalness: 0.5,
})

// watch materials
materials['rubber'] = new Three.MeshPhysicalMaterial({
  color: 0x000000, // black
  roughness: 0.5,
  metalness: 0.1,
})
materials['cotton'] = new Three.MeshPhysicalMaterial({
  color: 0x000000, // black
  roughness: 0.5,
  metalness: 0,
})
materials['plastic'] = new Three.MeshPhysicalMaterial({
  color: 0x000000, // black
  roughness: 0.5,
  metalness: 0,
})
materials['metal'] = new Three.MeshPhysicalMaterial({
  color: 0x000000, // black
  roughness: 0.5,
  metalness: 1,
})
materials['decal'] = new Three.MeshPhysicalMaterial({
  color: 0x000000, // black
  roughness: 0.5,
  metalness: 0,
})
materials['glass'] = new Three.MeshPhysicalMaterial({
  color: 0x000000, // black
  roughness: 0.5,
  metalness: 0,
})

export default materials