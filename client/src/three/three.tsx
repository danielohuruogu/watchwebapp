
import * as THREE from 'three'

import { useEffect, useRef } from 'react'
import getRhinoObject from '../rhino/rhinoObject'
import { Mesh, Sphere } from 'rhino3dm'


// the scene will be loaded in this file
// all the loaders will be called here. conversion for Three will also happen elsewhere

function Three() {
  const refContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getRhinoObject().then((shape: unknown) => {
      if (shape) {
        // rhino object is now available, but needs to be converted into a Three.js object
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

        let threeMesh

        // how do I get the mesh of a rhino3dm generic object?
        
        if (shape instanceof Mesh) {
          const loader = new THREE.BufferGeometryLoader()
          threeMesh = new THREE.Mesh(loader.parse(shape.toThreejsJSON()), material)
        }

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth, window.innerHeight)
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        if (refContainer.current) {
            refContainer.current.appendChild( renderer.domElement )
        }
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)
        if (threeMesh) scene.add(threeMesh)
        camera.position.z = 5
        // const animate = function () {
        //   requestAnimationFrame(animate)
        //   cube.rotation.x += 0.01
        //   cube.rotation.y += 0.01
        // }
        // animate()
        renderer.render(scene, camera)
      }
    })
  }, [])
  return (
    <div ref={refContainer}></div>

  )
}

export default Three