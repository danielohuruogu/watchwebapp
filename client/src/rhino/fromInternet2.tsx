// ******************* DUMPING GROUND FOR EXTRA CODE TO TRY AT A LATER STAGE

// import {
//     Rhino3dmLoader,
//     // OBJLoader
// } from 'three/examples/jsm/Addons.js'

// THIS IS CODE THAT WILL BE APPLICABLE ONCE MODELS ARE FETCHED FROM THE INTERNET

// const response = await fetch(modelPath)
// const arrayBuffer = await response.arrayBuffer()
// const binaryData = new Uint8Array(arrayBuffer)

// const doc = rhino.File3dm.fromByteArray(binaryData)

    // FOR LOADING A 3DM FILE
    // loader.load(
    //   modelPath,
    //   (object) => {
    //       object.traverse((child) => {
              // child.rotateX( - Math.PI / 4 )

              // // apply initial pbr material
              // child.material = material
    //       })
            // console.log('object is: ', object)
    //       geometryRef.current = object
    //       console.log('geometryRef.current is now: ', geometryRef.current)
    //       sceneRef.current?.add(object)
    //   },
    //   (xhr) => {
    //       console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    //   },
    //   (error) => {
    //       console.error(error)
    //   }
    // )