// import { useCallback, useEffect, useRef } from 'react'

import { useEffect, useState, useRef } from 'react'
import { OptionSelect } from '../components/optionSelect'
import { ColourSelect } from '../components/colourSelect'
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
  const { loadedFiles, modelOptionsRef, defaultModelRef, currentSelectionRef } = useThree()
  // create refs for the options
  const optionsRef = useRef<string[] | null>(null)
  const colourOptionsRef = useRef<string[] | null>(null)

  useEffect(() => {
    console.log('modelOptionsRef: ', modelOptionsRef.current)
    if (!loadedFiles) {
      // TODO
      console.log('will figure out how to handle this later')
      return
    }
    if (!modelOptionsRef.current) {
      console.error('modelOptionsRef.current is not set')
      return
    }

    // get the names of each partGroups associated with each partOptions
    // in modelOptionsRef.current, the first layer is the partOptions. this should be ['face', 'housing', 'strap', 'casing']
    // the second layer is the partGroups, which are the choices available for that partOptions. this should be ['digital', 'analogue1', 'analogue2'] for face, for example
    // I want each of the possible groups for each second layer option.

    // so for example, if I have selected the cotton strap, I want to get each of the groups for the strap - cotton option

    // this should be ['strap', 'buckle'] for example
    optionsRef.current = modelOptionsRef.current && Object.keys(modelOptionsRef.current)

    const something = modelOptionsRef.current && Object.entries(modelOptionsRef.current).forEach(([partType, option]) => { // example would be strap, cotton
      console.log('partType: ', partType)
      console.log('option: ', option)
      console.log('modelOptions[partType]: ', modelOptionsRef.current![partType])
      const selectedModelPart = modelOptionsRef.current![partType][option]
      console.log('selectedModelPart: ', selectedModelPart)
      if (!selectedModelPart) {
        console.error(`No model part found for ${selectedModelPart}`)
        return
      }
      colourOptionsRef.current = selectedModelPart.colours
      console.log('colourOptionsRef.current: ', colourOptionsRef.current)
    })
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
            const choices: string[] = []
            Object.keys(modelOptionsRef.current![part] as partOptions).forEach((choiceName) => {
              console.log('possible choice name is: ',choiceName)
              choices.push(choiceName)
            })
      
            return (
              <OptionSelect
                label={part}
                choices={choices}
              />
            )
        })}
      </div>
      <div className="colourSelect-area">
        {loading ? 
          <ColourSelect /> 
          : 
          (optionsRef.current && modelOptionsRef.current) && optionsRef.current.map(part => {
            const choices: string[] = []
            Object.keys(modelOptionsRef.current![part] as partOptions).forEach((choiceName) => {
              console.log('possible choice name is: ',choiceName)
              choices.push(choiceName)
            })
      
            return (
              <ColourSelect />
            )
        })}
      </div>
    </div>
  )
}