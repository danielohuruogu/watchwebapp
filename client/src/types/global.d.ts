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
  label: string;
  choices: string[];
  setOptions: React.Dispatch<React.SetStateAction<currentSelection>>;
}

interface ColourSelectProps {
  labelForPart: string;
  labelForOption: string;
  groups: partGroups;
}