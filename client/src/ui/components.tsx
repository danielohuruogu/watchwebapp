import { useEffect } from 'react'
import { useThree } from '../hooks/three'

export const Button = () => {
  const { geometryRef, sceneRef } = useThree()
  // I want this button to access the geometry refs of the Three contexts and change which geometry is currently being rendered
  
  useEffect(() => {
    // have to wait for the contexts to get mounted
    if (geometryRef.current) {
      console.log('geometryRef.current is now: ', geometryRef.current)
    } else {
      console.log('geometryRef.current is not yet mounted')
    }
  }, [geometryRef, sceneRef])


  const onClick = () => {
    console.log(geometryRef.current)
    console.log(sceneRef.current)
  }

  return (
    <button
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded`}
      onClick={onClick}
    >
      CLICK ME :)
    </button>
  )
}