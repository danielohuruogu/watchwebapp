import { useEffect, useState } from 'react'
import { useThree } from '../hooks/three'

export const OptionSelect = ({ label, choices, options, setOptions }: OptionSelectProps) => {
  // options should be an array of objects, each object containing a label and groups
  const [optionIndex, setOptionIndex] = useState(0)
  const [boxValue, setBoxValue] = useState<string>('option')

  // each time one of these is generated, create a label,
  // a name box for the current selected option and two buttons either side of the name box to cycle
  // through the options available for that part of the model
  // something like:
  /*
                  LABEL
          <      NAME BOX      >
  */

  const { defaultModelRef, currentSelectionRef } = useThree()

  const handleCycle = () => {
    setOptionIndex((prevIndex) => {
      const newIndex = prevIndex + 1
      if (newIndex >= choices.length) {
        return 0
      } else if (newIndex < 0) {
        return choices.length - 1
      } else {
        return newIndex
      }
    })
    setBoxValue(choices[optionIndex])
  }

  // TODO - WILL DEAL WITH SETTING THE FINISHED OPTION LATER
  // will need a useEffect to listen out for a change and apply after a delay
  useEffect(() => {
    console.log('selecting option: ', choices[0])
    if (!currentSelectionRef.current) return
    // currentSelectionRef.current[label] = choices[optionIndex]
    setOptions((prevOptions) => ({
      ...prevOptions,
      [label]: choices[optionIndex]
    }))
  }, [optionIndex]) // should only run when the options change or the index changes

  // for debugging
  useEffect(() => {
    console.log('currentSelectionRef: ', currentSelectionRef.current)
    console.log({options})
  }, [currentSelectionRef, options])

  // whatever the default options are for given parts, the name will need to be set in the text box from the start
  useEffect(() => {
    if (!defaultModelRef.current || !label || !defaultModelRef.current[label]) return
    setBoxValue(defaultModelRef.current[label])
  }, [defaultModelRef, label]) // should only run once when the component mounts

  return (
    <div className="option-select">
      <label className="option-select-label">{label.charAt(0).toUpperCase() + label.slice(1)}</label>
      <div className="option-select-box">
        <button
          className="a" 
          onClick={handleCycle}
          >
          Left
        </button>
        <input type="text" className="button" value={boxValue.charAt(0).toUpperCase() + boxValue.slice(1)} readOnly />
        <button
          className="a"
          onClick={handleCycle}
          >
          Right
        </button>
      </div>
    </div>
  )
}