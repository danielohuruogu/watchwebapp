import { useEffect, useRef } from 'react'
import { useThree } from '../hooks/three'
import { useInitScene } from '../hooks/initScene'
import { useLoader } from '../hooks/loader'
import { useAnimate } from '../hooks/animate'

import Header from '../ui/header'
import Button from '../components/button'
import downloadScreenshot from '../utils/download'
import { sizes } from '../utils/constants'

function Start () {
  const sceneContainer = useRef<HTMLDivElement>(null)

  const {
    sceneRef,
    rendererRef,
    cameraRef,
    displayLightsRef,
    loadedFiles,
    setLoadedFiles,
    loadModelsIntoScene,
    refsInitialised,
    orbitControlsRef,
    setAutoRotate,
    setDisplayLights
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
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        // set the renderer size to the new size of its container
        // if (sceneContainer.current) {
          // rendererRef.current.setSize(sceneContainer.current.clientWidth, sceneContainer.current.clientHeight)
        // }
        rendererRef.current.setSize(sizes.sceneWidth as number, window.innerHeight)
        orbitControlsRef.current?.update()
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

  const defaultStyles = {
    position: 'absolute',
    zIndex: 1000
  }

  const rotateStyles = Object.assign({}, defaultStyles, {
    top: '200px',
    left: '20px',
  })  as React.CSSProperties

  const downloadStyles = Object.assign({}, defaultStyles, {
    top: '200px',
    left: '100px',
  }) as React.CSSProperties

    const resetStyles = Object.assign({}, defaultStyles, {
    top: '240px',
    left: '20px',
  }) as React.CSSProperties

  const lightingStyles = Object.assign({}, defaultStyles, {
    top: '280px',
    left: '20px',
  }) as React.CSSProperties

  return (
    <div className='start-container'>
      < Header />
      <div ref={sceneContainer} className="scene-container" />
      <Button
        label="Auto rotate"
        onClick={() => {
          setAutoRotate((prevToggle) => {
            if (!orbitControlsRef.current) {
              console.warn('orbitControlsRef.current is not set')
              return prevToggle
            }
            return !prevToggle
          })
        }}
        styles={rotateStyles}
      />
      <Button
        label="Reset Camera"
        onClick={() => {
          if (!orbitControlsRef.current || !cameraRef.current) return
          orbitControlsRef.current.reset()
          cameraRef.current.position.set(-5, 5, 8)
          cameraRef.current.lookAt(0, 0, 0)
          orbitControlsRef.current.update()
        }}
        styles={resetStyles}
      />
      <Button
        label="Screenshot"
        onClick={() => {
          if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !orbitControlsRef.current) {
            console.warn('Renderer, scene, camera or orbit controls not initialized.')
            return
          }
          downloadScreenshot(rendererRef.current, sceneRef.current, cameraRef.current, orbitControlsRef.current)
        }}
        styles={downloadStyles}
      />
      <Button 
        label="Toggle lights"
        onClick={() => {
          setDisplayLights((prev) => {
            if (!displayLightsRef.current) {
              console.warn('displayLightsRef.current is not set')
              return prev
            }
            return !prev
          })
        }}
        styles={lightingStyles}
      />
    </div>
  )
}

export default Start