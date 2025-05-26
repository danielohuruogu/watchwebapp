export default function Button({ label, onClick, disabled = false, styles = {} }: { label: string; onClick: () => void; disabled?: boolean }) {

  
  return (
    <button
      className={`custom-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={styles}
    >
      {label}
    </button>
  )
}