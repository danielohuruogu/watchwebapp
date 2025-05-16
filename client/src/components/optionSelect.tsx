import { useEffect, useState } from 'react'
import { useThree } from '../hooks/three'

export const OptionSelect = ({ label, choices, setOptions }: OptionSelectProps) => {
  const [optionIndex, setOptionIndex] = useState(0)
  const [boxValue, setBoxValue] = useState<string>('')

  const { sceneRef, modelOptionsRef, defaultModelRef, currentSelectionRef } = useThree()

  // UTIL FUNCTIONS
  const handleCycleUp = () => {
    setOptionIndex((prevIndex) => {
      const newIndex = prevIndex + 1
      if (newIndex >= choices.length) {
        return 0
      } else {
        return newIndex
      }
    })
  }

  const handleCycleDown = () => {
    setOptionIndex((prevIndex) => {
      const newIndex = prevIndex - 1
      if (newIndex < 0) {
        return choices.length - 1
      } else {
        return newIndex
      }
    })
  }

  const toggleVisibility = () => {
    console.log('toggling visibility')
    console.log(currentSelectionRef.current)
    console.log(modelOptionsRef.current)
    console.log(sceneRef.current)

    // whatever is in the current selection, set the visibility of the model options to false
    // go through the scene and remove all model children

    if (!modelOptionsRef.current) {
      console.error('modelOptionsRef.current is not set')
      return
    }
    if (!currentSelectionRef.current) {
      console.error('currentSelectionRef.current is not set')
      return
    }

    if (!sceneRef.current) {
      console.error('sceneRef.current is not set')
      return
    }

    // remove all the children from the scene
    sceneRef.current.traverse((child) => {
      sceneRef.current?.remove(child)
      console.log('removing child: ', child)
    })

    // go through the current selection and add the children to the scene
    const currentSelection = currentSelectionRef.current
    const modelOptions = modelOptionsRef.current
    const partsOfWatch = Object.keys(currentSelection) // should be ['face', 'housing', 'strap', 'casing']
    Object.entries(partsOfWatch).forEach(([partType, option]) => { // example would be strap, cotton
      console.log('partType: ', partType)
      console.log('option: ', option)
      console.log('modelOptions[partType]: ', modelOptions[partType])
      const selectedModelPart = modelOptions[partType][option]
      console.log('selectedModelPart: ', selectedModelPart)
      if (!selectedModelPart) {
        console.error(`No model part found for ${selectedModelPart}`)
        return
      }
      // modelPart could be cotton strap - add all the children to the scene
      Object.values(selectedModelPart).forEach((group) => {
        console.log('group: ', group)
        if (!sceneRef.current) {
          console.error('sceneRef.current is not set')
          return
        }
        group.forEach((child) => {
          sceneRef.current?.add(child)
        })
      })
      console.log('models added to scene')
    })
  }

  // useEffect to set the default value of the select box on initiation
  useEffect(() => {
    if (!defaultModelRef.current || !label || !defaultModelRef.current[label]) return
    setBoxValue(defaultModelRef.current[label])
    setOptions((prevOptions) => ({
      ...prevOptions,
      [label]: defaultModelRef.current![label]
    }))

    // set the optionIndex to the index of the default option in the choices array
    const defaultOptionIndex = choices.indexOf(defaultModelRef.current[label])
    setOptionIndex(defaultOptionIndex)
  }, [defaultModelRef, label])

  // regular useEffect to set the values as the user changes them
  useEffect(() => {
    if (!currentSelectionRef.current) return

    // setting the states based on the index
    setBoxValue(choices[optionIndex])
    setOptions((prevOptions) => ({
      ...prevOptions,
      [label]: choices[optionIndex]
    }))
  }, [optionIndex])

  // useEffect to toggle the visibility of the model options
  useEffect(() => {
    if (!currentSelectionRef.current) return
    toggleVisibility()
  }, [currentSelectionRef]);

  return (
    <div className="option-select">
      <label className="option-select-label">{label.charAt(0).toUpperCase() + label.slice(1)}</label>
      <div className="option-select-box">
        <button
          className="a" 
          onClick={handleCycleDown}
          >
          {'<-'}
        </button>
        <input type="text" className="button" value={boxValue !== '' ? boxValue.charAt(0).toUpperCase() + boxValue.slice(1) : ''} readOnly />
        <button
          className="a"
          onClick={handleCycleUp}
          >
          {'->'}
        </button>
      </div>
    </div>
  )
}