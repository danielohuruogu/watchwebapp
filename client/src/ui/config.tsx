// import { useCallback, useEffect, useRef } from 'react'

import { useEffect, useState, useRef } from 'react'
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
  const [loading, setLoading] = useState(true)

  // pull in the model options from the context
  const { loadedFiles, modelOptionsRef } = useThree()
  // create refs for the options
  const optionsRef = useRef<string[] | null>(null)

  useEffect(() => {
    console.log('modelOptionsRef: ', modelOptionsRef.current)
    if (!loadedFiles) {
      // TODO
      console.log('will figure out how to handle this later')
      return
    }
    optionsRef.current = modelOptionsRef.current && Object.keys(modelOptionsRef.current) // should be ['face', 'housing', 'strap', 'casing']
    setLoading(false)
  }, [loadedFiles, modelOptionsRef])

  // TODO
  // would also need to rule out certain choices depending on what else has been selected
  // maybe another button to say Button or No Button

  return (
    <div className="config-section">
      <div className="optionSelect-area">
        {loading ?
          <OptionSelect label={'loading'} choices={['loading']} /> 
          : 
          (optionsRef.current && modelOptionsRef.current) && optionsRef.current.map(part => {
            const labelForSelector = part.charAt(0).toUpperCase() + part.slice(1)
          
            const choices: string[] = []
            Object.keys(modelOptionsRef.current![part] as partOptions).forEach((choiceName) => {
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