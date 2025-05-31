import { useEffect, useMemo, useRef, useState } from 'react'
import { OptionSelect } from '../components/optionSelect'
import { ColourSelect } from '../components/colourSelect'
import { Loading } from '../components/loading'
import { useThree } from '../hooks/three'
import { toggleVisibility } from '../utils/functions'

export default function Config() {
  const [loading, setLoading] = useState(true)
  // will end up looking like { strap: 'cotton', casing: 'button', face: 'standard', housing: 'standard' }
  const [currentSelection, setCurrentSelection] = useState<currentSelection>({})

  // for transitions
  const [groupTransitionClasses, setGroupTransitionClasses] = useState<Record<string, string>>({})

  // getting the refs from the useThree hook
  const { sceneRef, loadedFiles, modelOptionsRef, displayedSelectionRef, defaultModelRef } = useThree()

  // container for the model options to persist across renders
  const initialOptionsRef = useRef<string[] | null>(null)
  const hasInitialisedRef = useRef<boolean>(false)

  // indicating if its a valid choice given the "business" logic
  const validChoicesMap = useMemo((): { [key: string]: string[] } => {
    if (!currentSelection) return {}
    if (!initialOptionsRef.current) return {}
    const validChoices: { [key: string]: string[] } = {
      housing: ['standard', 'button'],
      casing: [],
      face: [],
      strap: ['cotton', 'rubber']
    }

    if (currentSelection.housing === 'standard') {
      validChoices.casing = ['standard']
      validChoices.face = ['analogue1', 'analogue2']
    } else if (currentSelection.housing === 'button') {
      validChoices.casing = ['button']
      validChoices.face = ['digital']
    }

    const rawChoices = Object.keys(modelOptionsRef.current || {})
    // filter the raw choices based on the valid choices map
    if (rawChoices.length === 0) {
      console.warn('No model options available yet')
      return {}
    }
    const finalChoicesMap: { [key: string]: string[] } = {}
    rawChoices.forEach((part) => {
      finalChoicesMap[part] = Object.keys(modelOptionsRef.current![part] || {}).filter(choice => validChoices[part] && validChoices[part].includes(choice))
    })
    return finalChoicesMap
  }, [currentSelection])

  useEffect(() => {
    if (!validChoicesMap || Object.keys(validChoicesMap).length === 0) return

    let updated = false
    const newSelection = { ...currentSelection }

    Object.entries(validChoicesMap).forEach(([part, validChoices]) => {
      // If the current selection for this part is not valid, pick the first valid choice
      if (!validChoices.includes(currentSelection[part])) {
        newSelection[part] = validChoices[0] || ''
        updated = true
      }
    })

    if (updated) {
      setCurrentSelection(newSelection)
    }
  }, [validChoicesMap])

  // useEffect to toggle the visibility of the model options
  useEffect(() => {
    if (!displayedSelectionRef.current || !sceneRef.current || !modelOptionsRef.current) return

    if (Object.keys(currentSelection).length > 0) {
      displayedSelectionRef.current = {}
      Object.entries(currentSelection).forEach(([partType, option]) => {
        const selectedModelPart = modelOptionsRef.current![partType][option]
        if (!selectedModelPart) {
          console.warn(`No model part found for ${partType}.${option}`)
          return
        }
        displayedSelectionRef.current = {
          ...displayedSelectionRef.current,
          [partType]: {
            [option]: selectedModelPart
          }
        }
      })
    }
    toggleVisibility(sceneRef.current, displayedSelectionRef.current)
  }, [currentSelection])

  // initialising everything
  useEffect(() => {
    if (!loadedFiles) {
      // TODO
      console.log('will figure out how to handle this later')
      return
    }
    if (!modelOptionsRef.current) {
      console.warn('modelOptionsRef.current is not yet set')
      return
    }
    if (!defaultModelRef.current) {
      console.warn('defaultModelRef.current is not yet set')
      return
    }
    if (hasInitialisedRef.current) {
      console.log(initialOptionsRef.current)
      return
    }

    // setting the initial options for the model
    initialOptionsRef.current = modelOptionsRef.current && Object.keys(modelOptionsRef.current)

    if (Object.keys(currentSelection).length > 0) {
      console.warn('currentSelection is already set, not resetting it')
      return
    }

    const initial: currentSelection = {}
    Object.entries(defaultModelRef.current).forEach(([part, option]) => {
      initial[part] = option
    })
    setCurrentSelection(initial)

    // finally set loading to false to load the page
    setLoading(false)
    hasInitialisedRef.current = true
  }, [loadedFiles, defaultModelRef.current, modelOptionsRef.current, hasInitialisedRef.current])

  return (
    <div className="config-container">
      <div className="optionSelect-area">
        {loading ?
          <Loading />
          : 
          (
            <div className="optionSelect-container">
              <div className="optionSelect-header">
                <h2>Options</h2>
              </div>
              <div className='optionSelect-items'>
                {(initialOptionsRef.current && hasInitialisedRef.current) &&
                initialOptionsRef.current.map(part => {
                  const choices = validChoicesMap && validChoicesMap[part as string]

                  return (
                    <OptionSelect
                      key={part} // e.g. strap, casing, face, housing
                      label={part} // e.g. strap, casing, face, housing
                      defaultValue={defaultModelRef.current[part]} // e.g. 'cotton', 'button', 'standard', 'rubber'
                      currentValue={currentSelection[part]}
                      choices={choices} // e.g. for strap, ['cotton', 'rubber']; for housing, ['button', 'standard']
                      setCurrentSelection={setCurrentSelection}
                      setGroupTransitionClasses={setGroupTransitionClasses}
                    />
                  )
                })}
              </div>
            </div>
          )}
      </div>
      <div className="colourSelect-area">
        {loading ? 
          <Loading />
          : 
          (
            <div className="colourSelect-container">
              <div className="colourSelect-header">
                <h2>Choose your style</h2>
              </div>
              {currentSelection && Object.entries(currentSelection).map(([part, option]) => {
                // get the groups for the selected option
                const groups = modelOptionsRef.current![part][option]
                
                return (
                  <ColourSelect
                    key={`${part}.${option}`} // e.g. strap, casing, face, housing
                    labelForPart={part}
                    labelForOption={option}
                    groups={groups}
                    optionTransitionClass={groupTransitionClasses[`${part}.${option}`] || 'fade-in'}
                  />
                )
              })}
            </div>
          )
        }
      </div>
    </div>
  )
}