import { useEffect, useRef } from 'react'
import { useThree } from '../hooks/three'
import { useInitScene } from '../hooks/initScene'
import { useLoader } from '../hooks/loader'
import { useAnimate } from '../hooks/animate'

import Header from '../ui/header'
import Button from '../components/button'

function Start () {
  const sceneContainer = useRef<HTMLDivElement>(null)

  const {
    sceneRef,
    rendererRef,
    cameraRef,
    loadedFiles,
    setLoadedFiles,
    loadModelsIntoScene,
    refsInitialised,
    orbitControlsRef,
    setDisplayToggle
  } = useThree()
  const { initScene } = useInitScene(sceneContainer)
  const { loadFile } = useLoader()
  const { animate } = useAnimate()

  useEffect(() => {
    initScene()
    console.log('initScene called')

    const animationId = animate()

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      // Cancel animation frame
      if (animationId) {
          cancelAnimationFrame(animationId)
      }
      // Remove the renderer from DOM
      if (rendererRef.current && sceneContainer.current) {
        sceneContainer.current.removeChild(rendererRef.current.domElement)
      }
      // Dispose Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [initScene, animate, sceneRef, rendererRef, cameraRef])

  useEffect(() => {
    if (loadedFiles) return
    // files ain't loaded yet - load them
    loadFile()
      .then(() => {
        console.log('files loaded')
        setLoadedFiles(true)
      })
  }, [loadedFiles, loadFile, setLoadedFiles])

  useEffect(() => {
    if (!loadedFiles || !refsInitialised) return

    console.log('files now loaded + refs initialised - adding models to scene')
    loadModelsIntoScene()
  }, [loadedFiles, refsInitialised, loadModelsIntoScene])

  const buttonStyles = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 1000
  }  as React.CSSProperties

  return (
    <div className='start-container'>
      < Header />
      <div ref={sceneContainer} className="scene-container" />
      <Button
        label="Display"
        onClick={() => {
          setDisplayToggle((prevToggle) => {
            if (!orbitControlsRef.current) {
              console.warn('orbitControlsRef.current is not set')
              return prevToggle
            }
            return !prevToggle
          })
        }}
        styles={buttonStyles}
      /> 
    </div>
  )
}

export default Start