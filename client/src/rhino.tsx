import rhino3dm from 'rhino3dm'
import {useEffect, useRef} from "react";

const rhino = await rhino3dm()
const sphere = new rhino.Sphere([0, 0, 0], 12)
console.log(sphere.diameter)

const someRhino = () => {
  const refContainer = useRef(null)
  useEffect(() => {

  }, []);
  return (
    <div ref={refContainer}></div>
  )
}

export default someRhino