interface partGroups {
  [key: string]: Three.Object3D[]
}
interface partOptions {
  [key: string]: partGroups
}
interface modelOptions {
  [key:string ]: partOptions
}