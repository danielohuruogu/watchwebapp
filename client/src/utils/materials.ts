import * as Three from 'three'

const materials: { [key: string]: Three.MeshPhysicalMaterial } = {}

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


export default materials