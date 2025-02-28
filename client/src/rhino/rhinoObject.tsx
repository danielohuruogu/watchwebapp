import rhino3dm, { Sphere } from "rhino3dm"

const getRhinoObject = async (): Promise<Sphere> => {
    return rhino3dm().then((module) => {
        const shape = new module.Sphere([0, 0, 0], 12)
        return shape
    })
}

export default getRhinoObject