import { useState, useEffect } from 'react'
import ColourPicker from './colourPicker'
import { useThree } from '../hooks/three'

export const ColourSelect = ({ labelForPart, labelForOption, groups }: ColourSelectProps) => {
  const { displayedSelectionRef } = useThree()
  
  // colours for all groups will be kept in a state
  const [groupColours, setGroupColours] = useState<currentSelection>({})
  
  // to handle pagination
  const itemsPerPage = 4
  const [currentPage, setCurrentPage] = useState(1)

  const groupEntries = Object.entries(groups || {})
  const totalPages = Math.ceil(groupEntries.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const visibleGroups = groupEntries.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    if (currentPage > 1)setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

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
      <label>
        {labelForOption && labelForOption.charAt(0).toUpperCase() + labelForOption.slice(1)}
      </label>
      <div className="colour-select-container">
        {visibleGroups.map(([groupName, groupChildren]) => (
            <div
              key={`${labelForPart}.${labelForOption}.${groupName}`}
              className="colour-select-group"
            >
              <label className="colour-select-label">
                {groupName
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
                }
              </label>
              <ColourPicker
                groupName={groupName}
                objectColour={groupChildren[0].material.color.getStyle()}
                setObjectColour={setGroupColours}
              />
            </div>
          )
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>{'<'}</button>
          <span>{currentPage}/{totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>{'>'}</button>
        </div>
      )}
    </div>
  )
}