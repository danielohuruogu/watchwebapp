// FOR THE MODELREFS
interface partGroups {
  [key: string]: Three.Object3D[]
}
interface partOptions {
  [key: string]: partGroups
}
interface modelOptions {
  [key:string ]: partOptions
}

// DEFAULT CONFIGURATIONS FOR THE MODELS BEFORE LOADING INTO SCENE
interface defaultConfigDigital extends modelOptions {
  housing: {
    button: partGroups
  },
  casing: {
    button: partGroups
  },
  strap: {
    cotton: partGroups
  },
  face: {
    digital: partGroups
  }
}

interface defaultConfigAnalogue extends modelOptions {
  housing: {
    standard: partGroups
  },
  casing: {
    standard: partGroups
  },
  strap: {
    rubber: partGroups
  },
  face: {
    analogue1: partGroups
  }
}