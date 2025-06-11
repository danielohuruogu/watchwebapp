import { useContext } from 'react'
import { AppContext } from '../utils/context'

export const useThree = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useThree must be used within a ThreeProvider')
  }
  return context
}