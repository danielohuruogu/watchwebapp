import { useState, useEffect } from 'react'
import ColourPicker from './colourPicker'
import { useThree } from '../hooks/three'

export const ColourSelect = ({ labelForPart, labelForOption, groups }: ColourSelectProps) => {
  const { displayedSelectionRef } = useThree()
  
  // colours for all groups will be kept in a state
  const [groupColours, setGroupColours] = useState<currentSelection>({})

  const changeColour = () => {
    if (!displayedSelectionRef.current) return
    Object.entries(groupColours).forEach(([groupName, colour]) => {
      const group = displayedSelectionRef.current![labelForPart][labelForOption][groupName]
      if (!group) return 
      group.forEach(child => {
        child.material.color.setStyle(colour)
      })
    })
  }

  useEffect(() => {
    if (!groups) return
    
    changeColour()
  }, [groupColours, displayedSelectionRef])

  return (
    <div className="colour-select">
      <label className="colour-select-label">
        {labelForPart && labelForPart.charAt(0).toUpperCase() + labelForPart.slice(1)}
      </label>
      {labelForOption}
      {groups && Object.entries(groups).map(([groupName, groupChildren]) => {
        return (
          <div
            key={`${labelForPart}.${labelForOption}.${groupName}`}
          >
            <label className="colour-select-label">
              {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
            </label>
            <ColourPicker
              groupName={groupName}
              objectColour={groupChildren[0].material.color.getStyle()}
              setObjectColour={setGroupColours}
            />
          </div>
        )
      })}
    </div>
  )
}