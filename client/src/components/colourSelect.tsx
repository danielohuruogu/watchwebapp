import { useState, useEffect } from 'react'
import ColourPicker from './colourPicker'
import { useThree } from '../hooks/three'

export const ColourSelect = ({ labelForPart, labelForOption, groups, optionTransitionClass }: ColourSelectProps) => {
  const { displayedSelectionRef } = useThree()
  
  // colours for all groups will be kept in a state
  const [groupColours, setGroupColours] = useState<currentSelection>({})
  
  // to handle pagination
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [transitionClass, setTransitionClass] = useState('fade-in')

  const groupEntries = Object.entries(groups || {})

  let isPaginationNeeded = false
  let totalPages = 1

  if (groupEntries.length > itemsPerPage) {
    isPaginationNeeded = true
    totalPages = Math.ceil(groupEntries.length / itemsPerPage)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const visibleGroups = groupEntries.slice(startIndex, endIndex)

  const placeholders = Array(itemsPerPage - visibleGroups.length).fill(null)

  const handlePageChange = (page: number) => {
    setTransitionClass('fade-out')
    setTimeout(() => {
      setCurrentPage(page)
      setTransitionClass('fade-in')
    }, 200)
  }

  const cyclePreviousPage = () => {
    const newPage = currentPage > 1 ? currentPage - 1 : totalPages
    handlePageChange(newPage)
  }

  const cycleNextPage = () => {
    const newPage = currentPage < totalPages ? currentPage + 1 : 1
    handlePageChange(newPage)
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
    <div className={`colour-select ${optionTransitionClass}`}>
      <div className='colour-select-header'>
        <span className='span-1'>
          {labelForPart && labelForPart.charAt(0).toUpperCase() + labelForPart.slice(1)}    
        </span>
        &nbsp;&nbsp;
        <span className='span-2'>
          {labelForOption && labelForOption.charAt(0).toUpperCase() + labelForOption.slice(1)}
        </span>
      </div>
      <div
        className={`colour-select-container ${transitionClass}`}
      >
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
        {isPaginationNeeded && placeholders.map((_, index) => (
          <div key={`placeholder-${index}`} className="colour-select-placeholder"></div>
        ))}
      </div>
      {isPaginationNeeded && (
          <div className="pagination-controls">
            <button onClick={cyclePreviousPage}>{'<'}</button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>{currentPage}/{totalPages}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={cycleNextPage}>{'>'}</button>
          </div>
        )}
    </div>
  )
}