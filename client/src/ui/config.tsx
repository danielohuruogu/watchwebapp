// import { useCallback, useEffect, useRef } from 'react'

import { useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState(false)

  // pull in the model options from the context
  const { modelOptionsRef } = useThree()
  let partsOfWatch: string[] = [] // should be ['face', 'housing', 'strap', 'casing']
  let modelOptions: modelOptions = {} // should be {face: {}, housing: {}, strap: {}, casing: {}}

  useEffect(() => {
    console.log('modelOptionsRef: ', modelOptionsRef.current)
    if (!modelOptionsRef.current) {
      // TODO
      console.log('will figure out how to handle this later')
      return
    }
    modelOptions = modelOptionsRef.current
    partsOfWatch = Object.keys(modelOptions) // should be ['face', 'housing', 'strap', 'casing']
    setLoading(true)
  }, [modelOptionsRef]) // should only run once when the component mounts
  // need to get the keys at the first level of the modelOptionsRef object


  // would also need to rule out certain choices depending on what else has been selected
  // maybe another button to say Button or No Button

  // the optionChoices will be the label for the options
  if (loading) {
    return (
      <OptionSelect label={'loading'} choices={['loading']} />
    )
  }

  return (
    <div className="config-section">
      <div className="optionSelect-area">
        {partsOfWatch.map(part => {
          const labelForSelector = part.charAt(0).toUpperCase() + part.slice(1)
          // need to deal with an object filled with objects, that I want to turn into an array of objects
          
          const choices: string[] = []
          Object.keys(modelOptions[part] as partOptions).forEach((choiceName) => {
            console.log('possible choice name is: ',choiceName)
            choices.push(choiceName)
          })
      
          return (
            <OptionSelect
              label={labelForSelector}
              choices={choices}
            />
          )
        })}
      </div>
      <div className="colourSelect-area">
        TODO
      </div>
    </div>
  )
}