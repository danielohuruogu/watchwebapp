import { useEffect, useState } from 'react'
import { useThree } from '../hooks/three'

export const OptionSelect = ({ label, choices, setCurrentSelection, setGroupTransitionClasses }: OptionSelectProps) => {
  const [optionIndex, setOptionIndex] = useState(0)
  const [boxValue, setBoxValue] = useState<string>('')

  const [initialised, setInitialised] = useState(false)

  const { defaultModelRef } = useThree()

  // UTIL FUNCTIONS
  const handleOptionChange = (newIndex: number) => {
    if(!initialised) return
    const currentOption = choices[optionIndex]
    const newOption = choices[newIndex]

    setGroupTransitionClasses((prevClasses) => ({
      ...prevClasses,
      [`${label}.${currentOption}`]: 'fade-out',
    }))

    setTimeout(() => {
      setOptionIndex(newIndex)
      setBoxValue(newOption)
      setGroupTransitionClasses((prevClasses) => ({
        ...prevClasses,
        [`${label}.${newOption}`]: 'fade-in',
      }))
      setCurrentSelection((prevSelection) => ({
        ...prevSelection,
        [label]: newOption
      }))
    }, 500)
  }

  const handleCycleUp = () => {
    const newIndex = optionIndex + 1 >= choices.length ? 0 : optionIndex + 1
    handleOptionChange(newIndex)
  }

  const handleCycleDown = () => {
    const newIndex = optionIndex - 1 < 0 ? choices.length - 1 : optionIndex - 1
    handleOptionChange(newIndex)
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
    setGroupTransitionClasses((prevClasses) => ({
      ...prevClasses,
      [`${label}.${defaultModelRef.current[label]}`]: 'fade-in'
    }))

    // set the optionIndex to the index of the default option in the choices array
    const defaultOptionIndex = choices.indexOf(defaultModelRef.current[label])
    setOptionIndex(defaultOptionIndex)
    setInitialised(true)
  }, [defaultModelRef, label])

  return (
    <div className="option-select">
      <label className="option-select-label">{label.charAt(0).toUpperCase() + label.slice(1)}</label>
      <div className="option-select-box">
        <a
          className="arrow-button" 
          onClick={handleCycleDown}
          >
          {'<'}
        </a>
        <div className="option-select-value">{boxValue !== '' ? boxValue.charAt(0).toUpperCase() + boxValue.slice(1) : ''}</div>
        <a
          className="arrow-button"
          onClick={handleCycleUp}
          >
          {'>'}
        </a>
      </div>
    </div>
  )
}