// import { useCallback, useEffect, useRef } from 'react'

import { OptionSelect } from '../components/optionSelect'
import { useThree } from '@hooks/three'

// I want a section of the screen to house the selector buttons
// for the different model options that could be generated for any given configuration of model

// there would only be 4 options selectors, but there could in theory be any.
// I want that to be flexible

// there could be any number of colour selectors, as there are a lot.
// I would want there to be a certain number of colour selectors available in a div
// if the number exceeds that, I want a second page to appear

export const Config = () => {
  // pull in the model options from the context
  const { modelOptionsRef } = useThree()
  // need to get the keys at the first level of the modelOptionsRef object
  const modelOptions: modelOptions = modelOptionsRef.current
  const optionChoices = Object.keys(modelOptions)

  // would also need to rule out certain choices depending on what else has been selected
  // maybe another button to say Button or No Button

  return (
    <div className="config-section">
      <div className="optionSelect-area">
        {optionChoices.map(optionChoice => {
          // get the options for this part
          const option = modelOptions[optionChoice]
          // get the keys of the options
          const optionKeys = Object.keys(option)
          // get the name of the part
          const partName = optionChoice.charAt(0).toUpperCase() + optionChoice.slice(1)
          return (
            <OptionSelect
              key={optionChoice}
              partName={partName}
              options={optionKeys}
            />
          )
        })}
      </div>
      <div className="colourSelect-area">
      </div>
    </div>
  )
}