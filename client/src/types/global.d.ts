export interface partGroups {
  [key: string]: Three.Object3D[]
}
export interface partOptions {
  [key: string]: partGroups
}
export interface modelOptions {
  [key:string ]: partOptions
}