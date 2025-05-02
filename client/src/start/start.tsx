import { useEffect, useRef } from 'react'
import { useThree } from '@hooks/three'
import { useInitScene } from '@hooks/initScene'
import { useLoader } from '@hooks/loader'
import { useAnimate } from '@hooks/animate'

function Start () {
  const ref = useRef<HTMLDivElement>(null)

  const { sceneRef, rendererRef, cameraRef, loadedFiles, setLoadedFiles, loadModelsIntoScene } = useThree()
  const { initScene } = useInitScene(ref)
  const { loadFile } = useLoader()
  const { animate } = useAnimate()


  useEffect(() => {
    initScene()
    console.log('initScene called')

    const animationId = animate()

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      // Cancel animation frame
      if (animationId) {
          cancelAnimationFrame(animationId)
      }
      // Remove the renderer from DOM
      if (rendererRef.current && ref.current) {
        ref.current.removeChild(rendererRef.current.domElement)
      }
      // Dispose Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [initScene, animate, sceneRef, rendererRef, cameraRef])

  useEffect(() => {
    console.log('loadedFiles: ', loadedFiles)
    if (!loadedFiles) {
      // files ain't loaded yet - load them
      console.log('loading files')
      loadFile()
        .then(() => {
          console.log('files loaded')
          setLoadedFiles(true)
        })
    }
  }, [loadedFiles, loadFile, setLoadedFiles])

  useEffect(() => {
    if (loadedFiles) {
      console.log('files are already loaded - load models into scene')
      loadModelsIntoScene()
    }
  }, [loadedFiles, loadModelsIntoScene])
  return <div ref={ref} />
}

export default Start