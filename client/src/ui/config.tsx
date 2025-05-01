// import { useCallback, useEffect, useRef } from 'react'

import { OptionSelect } from '../components/optionSelect'
import { useThree } from '../hooks/three'

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

  const modelOptions = modelOptionsRef.current?

  Object.keys(modelOptionsRef.current).map((key) => {
    return {
      name: key,
      options: Object.keys(modelOptionsRef.current![key])
    }
  }) : []

  // for the current configuration, need to get all the children of the model options
  // and then get the names of the children to use as the options for the select component

  return (
    <div className="config-section">
      <div className="optionSelect-area">
        {modelOptions.map((option) => {
          return (
            <OptionSelect
              key={option.name}
              name={option.name}
              options={option.options} // this is an array of the options for the part
            />
          )
        })}
      </div>
      <div className="colourSelect-area"></div>
    </div>
  )
}