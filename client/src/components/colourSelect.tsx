export const ColourSelect = ({ labelForPart, labelForOption, groups }: ColourSelectProps) => {
  // console.log('colour select labelForPart: ', labelForPart)
  // console.log('colour select labelForOption: ', labelForOption)
  // console.log('groups: ', groups)

  if (groups === null) return <div>no groups</div>
  Object.entries(groups).forEach(([groupName, groupChildren]) => {
    // console.log('groupName: ', groupName)
    // console.log('groupChildren: ', groupChildren)
    const colour = groupChildren[0].material.color
    // console.log('colour: ', colour)
  })

  const changeColour = (groupName: string, colour: string) => {
    // will be called on selector button change
    // on button change, colour will be applied to all children of the group
    // console.log('changing colour of group: ', groupName)
    // console.log('changing colour to: ', colour)
    // find the group in the modelOptionsRef.current and set the colour of all children to the new colour
  }

  return (
    <div className="colour-select">
      <label className="colour-select-label">
        {labelForPart && labelForPart.charAt(0).toUpperCase() + labelForPart.slice(1)}
      </label>
      {labelForOption}
      {/* {groups && groups.map((choice, index) => {
        return (
          <div key={index} className="colour-select-option">
            {choice}
          </div>
        )
      }
      )} */}
    </div>
  )
}