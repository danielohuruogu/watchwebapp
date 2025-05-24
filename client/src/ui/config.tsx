import { useEffect, useState, useRef } from 'react'
import { OptionSelect } from '../components/optionSelect'
import { ColourSelect } from '../components/colourSelect'
import { useThree } from '../hooks/three'
import { Loading } from '../components/loading'
import { toggleVisibility } from '../utils/toggleVisibility'

export default function Config() {
  const [loading, setLoading] = useState(true)
  // options state to keep track of all the current selections for each part
  // will end up looking like { strap: 'cotton', casing: 'button', face: 'standard', housing: 'standard' }
  const [currentSelection, setCurrentSelection] = useState<currentSelection>({})

  // for transitions
  const [groupTransitionClasses, setGroupTransitionClasses] = useState<Record<string, string>>({})

  // getting the refs from the useThree hook
  const { sceneRef, loadedFiles, modelOptionsRef, displayedSelectionRef } = useThree()

  // container for the model options to persist across renders
  const possibleOptionsRef = useRef<string[] | null>(null)

  // useEffect to toggle the visibility of the model options
  useEffect(() => {
    if (!displayedSelectionRef.current || !sceneRef.current || !modelOptionsRef.current) return

    if (Object.keys(currentSelection).length > 0) {
      displayedSelectionRef.current = {}
      Object.entries(currentSelection).forEach(([partType, option]) => {
        const selectedModelPart = modelOptionsRef.current![partType][option]
        if (!selectedModelPart) {
          console.error(`No model part found for ${partType}.${option}`)
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
  }, [displayedSelectionRef, currentSelection, modelOptionsRef]);

  // useEffect to initialise the choices
  useEffect(() => {
    if (!loadedFiles) {
      // TODO
      console.log('will figure out how to handle this later')
      return
    }
    if (!modelOptionsRef.current) {
      console.error('modelOptionsRef.current is not yet set')
      return
    }
    possibleOptionsRef.current = modelOptionsRef.current && Object.keys(modelOptionsRef.current)
    setLoading(false)
  }, [loadedFiles, modelOptionsRef, possibleOptionsRef])

  // TODO
  // would also need to rule out certain choices depending on what else has been selected
  // maybe another button to say Button or No Button

  return (
    <div className="config-section">
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
                {(possibleOptionsRef.current && modelOptionsRef.current) && possibleOptionsRef.current.map(part => {
                  const choices: string[] = []
                  Object.keys(modelOptionsRef.current![part] as partOptions).forEach((choiceName) => {
                    choices.push(choiceName)
                  })
        
                  return (
                    <OptionSelect
                      key={part} // e.g. strap, casing, face, housing
                      label={part} // e.g. strap, casing, face, housing
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