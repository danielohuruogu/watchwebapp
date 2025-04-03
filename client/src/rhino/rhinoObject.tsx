import { useCallback, useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as Three from 'three'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js'

interface GeometryObject extends Three.Object3D {
  geometry: Three.BufferGeometry
}

function RhinoToThree () {
  const ref = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Three.Scene>(null)
  const cameraRef = useRef<Three.PerspectiveCamera>(null)
  const geometryRef = useRef<Three.Mesh>(null)
  // const loadedGeometryRef = useRef<Three.Mesh>(null)
  const orbitControlsRef = useRef<OrbitControls>(null)
  const rendererRef = useRef<Three.WebGLRenderer>(null)
  const loadFileCalled = useRef(false)

  const initScene = useCallback(() => {
    if (!ref.current) {
      console.error('ref.current is null - skipping initScene')
      return
    }
    if (sceneRef.current) {
      console.log('sceneRef.current already exists - skipping initScene')
      return
    }
    console.log('initialising the scene')

    const scene = new Three.Scene()
    scene.background = new Three.Color(0xeeeeee)
    scene.fog = new Three.Fog(0xeeeeee, 0.015, 100)
    scene.add(new Three.AxesHelper(100))
    scene.add(new Three.GridHelper(100, 100))
    scene.add(new Three.AmbientLight(0x404040, 2))
    
    sceneRef.current = scene

    const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    cameraRef.current = camera

    scene.add(camera)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(800, 800)
    rendererRef.current = renderer

    ref.current?.appendChild(renderer.domElement)

    // orbit controls
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControlsRef.current = orbitControls

    camera.position.z = 2

    console.log('finished initialising the scene')
  }, [])

  const loadFile = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !orbitControlsRef.current) return
    if (loadFileCalled.current) {
      console.log('loadFile already called')
      return
    }

    const modelPaths = [
      '/assets/housing_button.3dm',
      '/assets/housing_standard.3dm',
      '/assets/complete_digital.3dm',
      '/assets/complete_analogue_face-1.3dm'
    ]

    const models = []
    const loader = new Rhino3dmLoader()
    loader.setLibraryPath('https://unpkg.com/rhino3dm@8.4.0/')

    for (let i = 0; i < modelPaths.length; i++) {
      console.log('loading model: ', modelPaths[i])
      loader.load(
        modelPaths[i],
        (object: Three.Object3D) => {
            object.traverse((child) => {
              console.log({child})
              if (child instanceof Three.Mesh) {
                console.log('child is a mesh')
                child.material = new Three.MeshStandardMaterial({
                  color: 0x00ff00,
                  side: Three.DoubleSide,
                })
                child.scale.set(0.1, 0.1, 0.1)
              } else {
                // convert geometry to mesh
                if ((child as GeometryObject).geometry instanceof Three.BufferGeometry) {
                  console.log('child is a buffer geometry')
                  const mesh = new Three.Mesh((child as GeometryObject).geometry, new Three.MeshStandardMaterial({
                    color: 0x00ff00,
                    side: Three.DoubleSide,
                    flatShading: true,
                  }))
                  mesh.scale.set(0.1, 0.1, 0.1)
                  child = mesh
                } else {
                  console.log('child is not a mesh or buffer geometry: ', child)
                }
              }
            }
          )
          object.rotateX(-Math.PI / 2)
          object.position.x += i*5
          models.push(object)
          sceneRef.current?.add(object)
          console.log('loaded object: ', object)
        },
        (xhr: ProgressEvent) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded')
        },
        (error: unknown) => {
          console.error('An error happened: ', error)
        }
      )
    }

    const geometry = new Three.BoxGeometry()
    const material = new Three.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new Three.Mesh(geometry, material)

    geometryRef.current = cube as Three.Mesh
    console.log('geometryRef.current is now: ', geometryRef.current)
    sceneRef.current?.add(cube)

    loadFileCalled.current = true
    console.log('loadFileCalled is now: ', loadFileCalled.current)
  }, [])

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !orbitControlsRef.current) return
    
    const animationId = requestAnimationFrame(animate)
    
    if (geometryRef.current) {
      geometryRef.current.rotation.x += 0.01
      geometryRef.current.rotation.y += 0.01
    }

    orbitControlsRef.current.update()
    rendererRef.current.render(sceneRef.current, cameraRef.current)

    return animationId
  }, [])


  useEffect(() => {
    initScene()
    loadFile()
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
  }, [initScene, loadFile, animate])

  return <div ref={ref} />
}

export default RhinoToThree