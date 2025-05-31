import { useEffect, useRef, useState, useMemo } from 'react'
import Button from './button'

export const OptionSelect = ({ label, choices, defaultValue, currentValue, setCurrentSelection, setGroupTransitionClasses }: OptionSelectProps) => {
  const [optionIndex, setOptionIndex] = useState(0) // for keeping track of the current option index
  const [boxValue, setBoxValue] = useState<string>('') // for setting the value in the selection box

  const [initialised, setInitialised] = useState(false) // to check if the component has been initialised with the default value

  const disabled = useRef<boolean>(false)

  // UTIL FUNCTIONS
  const handleOptionChange = (newIndex: number) => {
    if(!initialised) return
    const newOption = choices[newIndex]

    setGroupTransitionClasses((prevClasses) => ({
      ...prevClasses,
      [`${label}.${choices[optionIndex]}`]: 'fade-out',
      [`${label}.${newOption}`]: 'fade-in',
    }))

    setOptionIndex(newIndex)
    setBoxValue(newOption)
    setCurrentSelection((prevSelection) => {
      if (prevSelection[label] === newOption) return prevSelection
      return {
        ...prevSelection,
        [label]: newOption
      }
    })
  }

  const handleCycleUp = () => {
    const newIndex = optionIndex + 1 >= choices.length ? 0 : optionIndex + 1
    handleOptionChange(newIndex)
  }

  const handleCycleDown = () => {
    const newIndex = optionIndex - 1 < 0 ? choices.length - 1 : optionIndex - 1
    handleOptionChange(newIndex)
  }
  
  const shouldBeDisabled = useMemo(() => {
    if (choices.length <= 1) {
      disabled.current = true
    } else {
      disabled.current = false
    }
    return disabled.current
  }, [choices.length])

  // useEffect to set the default value of the select box on initiation
  useEffect(() => {
    if (!label || !defaultValue) return
    if (initialised) return
    // set the default text to the value in the default model for that part
    setBoxValue(defaultValue)
    // set the big options state to also have the same value
    setGroupTransitionClasses((prevClasses) => ({
      ...prevClasses,
      [`${label}.${defaultValue}`]: 'fade-in'
    }))

    // set the optionIndex to the index of the default option in the choices array
    const defaultOptionIndex = choices.indexOf(defaultValue)
    setOptionIndex(defaultOptionIndex)
    setInitialised(true)
  }, [label, defaultValue, choices])

  // update the values as the currentValue changes
  useEffect(() => {
    if (!initialised || !choices.length) return
    if (choices.length === 0) return
    setBoxValue(currentValue)
    const currentIndex = choices.indexOf(currentValue)
    setOptionIndex(currentIndex)
    // reset the group transition classes for the new choices
    setGroupTransitionClasses((prevClasses) => ({
      ...prevClasses,
      [`${label}.${currentValue}`]: 'fade-in'
    }))
  }, [currentValue])

  return (
    <div className="option-select">
      <label className="option-select-label">{label.charAt(0).toUpperCase() + label.slice(1)}</label>
      <div className="option-select-box">
        <Button
          id={'arrow-button-down'}
          className='arrow-button'
          label={'<'}
          onClick={handleCycleDown}
          disabled={shouldBeDisabled} // disable if choices length is 1 or less
        />
        <div className="option-select-value">{boxValue !== '' ? boxValue.charAt(0).toUpperCase() + boxValue.slice(1) : ''}</div>
        <Button
          id={'arrow-button-up'}
          className='arrow-button'
          label={'>'}
          onClick={handleCycleUp}
          disabled={shouldBeDisabled} // disable if choices length is 1 or less
        />
      </div>
    </div>
  )
}