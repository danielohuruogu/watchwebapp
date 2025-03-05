import rhino3dm from 'rhino3dm'
import {useEffect, useRef} from 'react'

const SomeRhino = () => {
  const refContainer = useRef(null)
  useEffect(() => {
    rhino3dm().then((module) => {
      const sphere = new module.Sphere([0, 0, 0], 12)
      console.log(sphere.diameter)
    })
  }, []);
  return (
    <div ref={refContainer}></div>
  )
}

export default SomeRhino