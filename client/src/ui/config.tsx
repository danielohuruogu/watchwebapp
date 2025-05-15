import { useEffect, useState, useRef } from 'react'
import { OptionSelect } from '../components/optionSelect'
import { ColourSelect } from '../components/colourSelect'
import { useThree } from '../hooks/three'
import { Loading } from '../components/loading'

export const Config = () => {
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState<currentSelection>({})

  const { loadedFiles, modelOptionsRef, currentSelectionRef } = useThree()
  const optionsRef = useRef<string[] | null>(null)

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
    optionsRef.current = modelOptionsRef.current && Object.keys(modelOptionsRef.current)

    setLoading(false)
  }, [loadedFiles, modelOptionsRef, currentSelectionRef])

  // TODO
  // would also need to rule out certain choices depending on what else has been selected
  // maybe another button to say Button or No Button

  return (
    <div className="config-section">
      <div className="optionSelect-area">
        {loading ?
          <Loading />
          : 
          (optionsRef.current && modelOptionsRef.current) && optionsRef.current.map(part => {
            const choices: string[] = []
            Object.keys(modelOptionsRef.current![part] as partOptions).forEach((choiceName) => {
              choices.push(choiceName)
            })
      
            return (
              <OptionSelect
                key={part} // e.g. strap, casing, face, housing
                label={part} // e.g. strap, casing, face, housing
                choices={choices} // e.g. ['cotton', 'rubber'] or ['button', 'standard']
                setOptions={setOptions}
              />
            )
        })}
      </div>
      <div className="colourSelect-area">
        {loading ? 
          <Loading />
          : 
          options && Object.entries(options).map(([part, option]) => {
            // get the groups for the selected option
            const groups = modelOptionsRef.current![part][option]
            
            return (
              <ColourSelect
                key={`${part}.${option}`} // e.g. strap, casing, face, housing
                labelForPart={part}
                labelForOption={option}
                groups={groups}
              />
            )
          }
        )}
      </div>
    </div>
  )
}