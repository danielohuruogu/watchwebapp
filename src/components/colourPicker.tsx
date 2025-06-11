import { useState, useRef, useEffect } from "react"
import { HexColorPicker } from "react-colorful"

export default function ColourPicker({ groupName, objectColour, setObjectColour }: ColourPickerProps) {
  const [currentColour, setCurrentColour] = useState<string>(objectColour)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  const updateColour = (newColour: string) => {
    setCurrentColour(newColour)
    setObjectColour((prevColours) => ({
      ...prevColours,
      [groupName]: newColour
    }))
  }

  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="color-picker-container" ref={pickerRef}>
      <div
        className="color-swatch"
        style={{ backgroundColor: currentColour }}
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {isOpen && (
        <div className="popover">
          <HexColorPicker color={currentColour} onChange={updateColour} />
        </div>
      )}
    </div>
  )
}