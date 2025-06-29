import { useEffect } from 'react'
import { GameAction } from '../types/game'

/**
 * Hook for handling game keyboard input
 */
export function useGameInput(dispatch: (action: GameAction) => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default browser behavior for game keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'Space'].includes(event.key)) {
        event.preventDefault()
      }

      switch (event.key) {
        case 'ArrowLeft':
          dispatch({ type: 'MOVE_LEFT' })
          break
        case 'ArrowRight':
          dispatch({ type: 'MOVE_RIGHT' })
          break
        case 'ArrowDown':
          dispatch({ type: 'MOVE_DOWN' })
          break
        case 'ArrowUp':
        case ' ': // Space bar
          dispatch({ type: 'ROTATE_CW' })
          break
        case 'z':
        case 'Z':
          dispatch({ type: 'ROTATE_CCW' })
          break
        case 'Shift':
          dispatch({ type: 'HOLD' })
          break
        case 'Control':
          dispatch({ type: 'HARD_DROP' })
          break
        case 'p':
        case 'P':
          dispatch({ type: 'PAUSE_TOGGLE' })
          break
        case 'r':
        case 'R':
          dispatch({ type: 'RESTART_GAME' })
          break
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch])
} 