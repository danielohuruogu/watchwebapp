import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import { useCallback, useEffect, useRef } from 'react'
// import rhinoMethods from '../rhino/rhinoObject'
import {
    Rhino3dmLoader,
    // OBJLoader
} from 'three/examples/jsm/Addons.js'


const defaultOptions = {
  background: '#F0F0F0',
  axis: true,
  sceneSize: 500,
  axisSize: 100,
  grid: {
    show: true,
    size: 2000,
    cellSize: 10,
    major: 5,
  }
}

function Three() {
  // refs for DOM Elements
  const refContainer = useRef<HTMLDivElement>(null)

  // refs for Three.js objects
  const refScene = useRef<THREE.Scene>(null)
  const refCamera = useRef<THREE.PerspectiveCamera>(null)
  const refRenderer = useRef<THREE.WebGLRenderer>(null)
  // const refGeometry = useRef<THREE.BoxGeometry>(null)
  // const refMaterial = useRef<THREE.MeshBasicMaterial>(null)
  const refOrbitControls = useRef<OrbitControls>(null)

  const initScene = useCallback(() => {
    if (refScene.current || refCamera.current || refRenderer.current) return

    // set the scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(defaultOptions.background)
    refScene.current = scene
    if (defaultOptions.axis) {
      scene.add(new THREE.AxesHelper(defaultOptions.axisSize))
    }
  
    // set the camera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 100)
    refCamera.current = camera
    camera.position.set(0, 0, 100)
    // camera.lookAt(scene.position)
    const gridHelper = new THREE.GridHelper(100, 10)
    refScene.current.add(gridHelper)
    scene.add(camera)

    // Add lighting
    const hemispheric = new THREE.HemisphereLight(0xffffff, 0x222222, 1) // skyColor, groundColor, intensity
    scene.add(hemispheric)

    // set the renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
      alpha: true
    })
    refRenderer.current = renderer
    renderer.setClearColor(0x131316, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(800, 800)
    if (refContainer.current) {
        refContainer.current.appendChild( renderer.domElement )
    }

    // orbit controls
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    refOrbitControls.current = orbitControls

    // const objects = rhinoMethods.loadRhinoObject()
    // objects.forEach((object) => {
    //   scene.add(object)
    // })

    renderer.render(scene, camera)

    return { scene, camera, renderer, orbitControls }
  }, [])

  const loadModel = useCallback(() => {
    if (!refScene.current || !refCamera.current || !refOrbitControls.current) return
    const orbitControls = refOrbitControls.current

    const modelPath = 'public/assets/circle_test.3dm'
    const loader = new Rhino3dmLoader()
    // const camera = refCamera.current
    // const cameraPos = new THREE.Vector3(-0.2, 0.4, 1.4)
    
    const material = new THREE.MeshNormalMaterial()
    

    loader.load(
      modelPath,
      (object) => {
        // object.updateMatrixWorld()

        // const boundingBox = new THREE.Box3().setFromObject(object)
        // const modelSizeVec3 = new THREE.Vector3()
        // boundingBox.getSize(modelSizeVec3)
        // const modelSize = modelSizeVec3.length()
        // const modelCenter = new THREE.Vector3()
        // boundingBox.getCenter(modelCenter)

        // camera.position.copy(modelCenter)
        // camera.position.x += modelSize * cameraPos.x
        // camera.position.y += modelSize * cameraPos.y
        // camera.position.z += modelSize * cameraPos.z
        // camera.near = modelSize / 100
        // camera.far = modelSize * 100
        // camera.updateProjectionMatrix()
        // camera.lookAt(modelCenter)

        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (child.material && 'bumpMap' in child.material) {
                    child.material.bumpMap = null
                }
                child.material = material
            }
        })
        object.position.set(0, 0, 0)
        refScene.current?.add(object)

        orbitControls.update()
        // console.log('camera position', camera.position)
        // console.log('bounding box', boundingBox)
      },
      (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded')
      },
      (error) => {
          console.error(error)
      }
    )
  }, [])

  useEffect(() => {
    initScene()
    loadModel()

    return () => {
      // // Cancel animation frame
      // if (animationId) {
      //     cancelAnimationFrame(animationId)
      // }
      // Remove the renderer from DOM
      if (refRenderer.current && refContainer.current) {
          refContainer.current.removeChild(refRenderer.current.domElement)
      }
      // Dispose Three.js resources
      if (refRenderer.current) {
          refRenderer.current.dispose()
      }
      // if (decalGeometryRef.current) {
      //     decalGeometryRef.current.dispose()
      // }
    }
  }, [initScene, loadModel])

  return (
    <div ref={refContainer}></div>
  )
}

export default Three