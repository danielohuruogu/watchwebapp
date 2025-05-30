import { JSX } from "react"

export default function Button({ id, className, label, onClick, disabled = false, styles = {} }: ButtonProps): JSX.Element { 
  return (
    <button
      id={id}
      className={`custom-button ${className} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={styles}
    >
      {label}
    </button>
  )
}