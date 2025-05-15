import { useEffect, useState } from 'react'
import { useThree } from '../hooks/three'

export const OptionSelect = ({ label, choices, setOptions }: OptionSelectProps) => {
  // options should be an array of objects, each object containing a label and groups
  const [optionIndex, setOptionIndex] = useState(0)
  const [boxValue, setBoxValue] = useState<string>('')

  const { defaultModelRef, currentSelectionRef } = useThree()

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

  // TODO - WILL DEAL WITH SETTING THE FINISHED OPTION LATER
  // will need a useEffect to listen out for a change and apply after a delay
  useEffect(() => {
    if (!currentSelectionRef.current) return

    // setting the states based on the index
    setBoxValue(choices[optionIndex])
    setOptions((prevOptions) => ({
      ...prevOptions,
      [label]: choices[optionIndex]
    }))
  }, [optionIndex])

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