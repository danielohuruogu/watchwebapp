/// <reference types="three" />

declare global {
  // FOR THE MODELREFS
  export interface partGroups {
    [key: string]: THREE.Object3D[]
  }
  
  export interface partOptions {
    [key: string]: partGroups
  }

  export interface models {
    [key:string ]: partOptions
  }

  // DEFAULT CONFIGURATIONS FOR THE MODELS BEFORE LOADING INTO SCENE

  export interface currentSelection {
    [key: string]: string
  }

  export interface defaultConfigDigital extends currentSelection {
    housing: 'button',
    casing: 'button',
    face: 'digital',
    strap: 'cotton'
  }

  export interface defaultConfigAnalogue extends currentSelection {
    housing: 'standard',
    casing: 'standard',
    face: 'analogue1' | 'analogue2',
    strap: 'rubber'
  }

  // INTERFACES FOR PROPS
  export interface OptionSelectProps {
    label: string,
    choices: string[],
    defaultValue: string,
    currentValue: string,
    setCurrentSelection: React.Dispatch<React.SetStateAction<currentSelection>>,
    setGroupTransitionClasses: React.Dispatch<React.SetStateAction<Record<string, string>>>
  }

  export interface ColourSelectProps {
    labelForPart: string,
    labelForOption: string,
    groups: partGroups,
    optionTransitionClass: string
  }

  export interface ColourPickerProps {
    groupName: string,
    objectColour: string,
    setObjectColour: React.Dispatch<React.SetStateAction<currentSelection>>
  }

  export interface ButtonProps {
    id: string,
    className: string,
    label: string,
    onClick: () => void,
    disabled?: boolean,
    styles? : React.CSSProperties
  }

  // cancellable promise type
  export type CancellablePromise<T> = Promise<T> & { cancel: () => void }
}

export {}