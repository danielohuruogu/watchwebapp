import { useEffect, useState } from 'react'
import { useThree } from '../hooks/three'

export const OptionSelect = ({ label, choices, setCurrentSelection }: OptionSelectProps) => {
  const [optionIndex, setOptionIndex] = useState(0)
  const [boxValue, setBoxValue] = useState<string>('')
  const [initialised, setInitialised] = useState(false)

  const { defaultModelRef } = useThree()

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

  // useEffect to set the default value of the select box on initiation
  useEffect(() => {
    if (!defaultModelRef.current || !label || !defaultModelRef.current[label]) return
    // set the default text to the value in the default model for that part
    setBoxValue(defaultModelRef.current[label])
    // set the big options state to also have the same value
    setCurrentSelection((prevSelection) => ({
      ...prevSelection,
      [label]: defaultModelRef.current![label]
    }))

    // set the optionIndex to the index of the default option in the choices array
    const defaultOptionIndex = choices.indexOf(defaultModelRef.current[label])
    setOptionIndex(defaultOptionIndex)
    setInitialised(true)
  }, [defaultModelRef, label])

  // regular useEffect to set the values as the user changes them
  useEffect(() => {
    // setting the states based on the index
    if (!initialised) return
    setBoxValue(choices[optionIndex])
    setCurrentSelection((prevSelection) => ({
      ...prevSelection,
      [label]: choices[optionIndex]
    }))
  }, [optionIndex, initialised])

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