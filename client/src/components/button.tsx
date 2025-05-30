import { JSX } from "react"

export default function Button({ label, onClick, disabled = false, styles = {} }: ButtonProps): JSX.Element { 
  return (
    <button
      id={label.replace(/\s+/g, '-').toLowerCase()}
      className={`custom-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={styles}
    >
      {label}
    </button>
  )
}