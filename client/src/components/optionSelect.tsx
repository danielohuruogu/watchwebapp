export const OptionSelect = (props) => {
  const { name, options } = props
  return (
    <div className="option-select">
      {name}
      {options.map((option) => {
        return (
          <div key={option} className="option-select-item">
            {option}
          </div>
        )
      })}
    </div>
  )
}