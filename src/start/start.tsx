import { useEffect, useRef } from 'react'
import { useThree } from '../hooks/three'
import { useInitScene } from '../hooks/initScene'
import { useLoader } from '../hooks/loader'
import { useAnimate } from '../hooks/animate'

import Header from '../ui/header'
import Button from '../components/button'
import { downloadScreenshot, resetCamera } from '../utils/functions'
import { aspectRatio, sizes } from '../utils/constants'

function Start () {
  const sceneContainer = useRef<HTMLDivElement>(null)

  const {
    sceneRef,
    rendererRef,
    cameraRef,
    displayLightsRef,
    loadedFiles,
    setLoadedFiles,
    setInitialModels,
    refsInitialised,
    orbitControlsRef,
    autoRotate,
    setAutoRotate,
    displayLights,
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
        cameraRef.current.aspect = aspectRatio
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(sizes.renderSceneWidth as number, sizes.renderSceneHeight as number)
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
    const promise = loadFile()
    promise.then(() => {
        console.log('files loaded')
        setLoadedFiles(true)
      })

    return () => {
      if (promise.cancel) promise.cancel()
    }
  }, [loadedFiles, loadFile, setLoadedFiles])

  useEffect(() => {
    if (!loadedFiles || !refsInitialised) return

    console.log('files now loaded + refs initialised - adding models to scene')
    setInitialModels()
  }, [loadedFiles, refsInitialised, setInitialModels])

  return (
    <div className='start-container'>
      < Header />
      <div className='controls-container'>
        <Button
          id="screenshot-button"
          className='screenshot'
          label="Screenshot"
          onClick={() => {
            if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !orbitControlsRef.current) {
              console.warn('Renderer, scene, camera or orbit controls not initialized.')
              return
            }
            downloadScreenshot(rendererRef.current, sceneRef.current, cameraRef.current, orbitControlsRef.current)
          }}
        />
        <Button
          id="reset-camera-button"
          className='reset-camera'
          label="Reset Camera"
          onClick={() => {
            if (!orbitControlsRef.current || !cameraRef.current) return
            resetCamera(orbitControlsRef.current, cameraRef.current)
          }}
        />
        <Button
          id='auto-rotate-button'
          className='rotate'
          label={autoRotate ? 'Auto rotate: ON' : 'Auto rotate: OFF'}
          onClick={() => {
            setAutoRotate((prevToggle) => {
              if (!orbitControlsRef.current) {
                console.warn('orbitControlsRef.current is not set')
                return prevToggle
              }
              return !prevToggle
            })
          }}
        />
        <Button
          id="toggle-lights-button"
          className='toggle-lights'
          label={displayLights ? 'Display Lights: ON' : 'Display Lights: OFF'}
          onClick={() => {
            setDisplayLights((prev) => {
              if (!displayLightsRef.current) {
                console.warn('displayLightsRef.current is not set')
                return prev
              }
              return !prev
            })
          }}
        />
      </div>
      <div ref={sceneContainer} className="scene-container" />
    </div>
  )
}

export default Start