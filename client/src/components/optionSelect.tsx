import { useEffect, useState } from 'react'
import { useThree } from '../hooks/three'

export const OptionSelect = ({ label, choices }: OptionSelectProps) => {
  // options should be an array of objects, each object containing a label and groups
  const [optionIndex, setOptionIndex] = useState(0)
  const [option, setOption] = useState<string | null>(null)

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
    console.log('cycling through options')
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
    setOption(choices[optionIndex])
  }

  // will need a useEffect to listen out for a change and apply after a delay
  useEffect(() => {
    console.log('selecting option: ', choices[0])
    if (!currentSelectionRef.current) return
    currentSelectionRef.current[label] = choices[optionIndex]
    console.log(currentSelectionRef.current)
  }, [choices, optionIndex, label, currentSelectionRef]) // should only run when the options change or the index changes

  // whatever the default options are for given parts, the name will need to be set in the text box from the start
  useEffect(() => {
    if (!defaultModelRef.current || !label) return
    setOption(Object.keys(defaultModelRef.current[label])[0])
  }, [defaultModelRef, label]) // should only run once when the component mounts

  return (
    <div className="option-select">
      <label className="option-select-label">{label}</label>
      <div className="option-select-box">
        <button
          className="a" 
          onClick={handleCycle}
          >
          Left
        </button>
        <input type="text" className="button" value={option || 'empty box'} readOnly />
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