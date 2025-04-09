import { useContext } from 'react'
import { ThreeContext } from '../utils/utils'

export const useThree = () => {
  const context = useContext(ThreeContext)
  if (!context) {
    throw new Error('useThree must be used within a ThreeProvider')
  }
  return context
}