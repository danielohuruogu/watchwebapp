// FOR THE MODELREFS
interface partGroups {
  [key: string]: Three.Object3D[]
}
interface partOptions {
  [key: string]: partGroups
}
interface models {
  [key:string ]: partOptions
}

// DEFAULT CONFIGURATIONS FOR THE MODELS BEFORE LOADING INTO SCENE

interface currentSelection {
  [key: string]: string
}
interface defaultConfigDigital extends currentSelection {
  housing: 'button',
  casing: 'button',
  strap: 'cotton',
  face: 'digital'
}

interface defaultConfigAnalogue extends currentSelection{
  housing: 'standard',
  casing: 'standard',
  strap: 'rubber',
  face: 'analogue1' | 'analogue2'
}

// INTERFACES FOR PROPS
interface OptionSelectProps {
  label: string,
  choices: string[],
  setCurrentSelection: React.Dispatch<React.SetStateAction<currentSelection>>,
  setGroupTransitionClasses: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

interface ColourSelectProps {
  labelForPart: string,
  labelForOption: string,
  groups: partGroups,
  optionTransitionClass: string
}

interface ColourPickerProps {
  groupName: string,
  objectColour: string,
  setObjectColour: React.Dispatch<React.SetStateAction<currentSelection>>
}

interface ButtonProps {
  id: string,
  className: string,
  label: string,
  onClick: () => void,
  disabled?: boolean,
  styles? : React.CSSProperties
}