import React, { memo, useMemo } from 'react'
import { CellState } from '../types/game'

interface CellProps {
  state: CellState
  className?: string
}

// Tetris piece colors using CSS custom properties for theming
const getCellClasses = (state: CellState): string => {
  switch (state) {
    case 'empty':
      return 'border-gray-700'
    case 'I':
      return 'border-2 shadow-inner'
    case 'O':
      return 'border-2 shadow-inner'
    case 'T':
      return 'border-2 shadow-inner'
    case 'S':
      return 'border-2 shadow-inner'
    case 'Z':
      return 'border-2 shadow-inner'
    case 'J':
      return 'border-2 shadow-inner'
    case 'L':
      return 'border-2 shadow-inner'
    case 'ghost':
      return 'bg-transparent border-dashed opacity-50'
    default:
      return 'border-gray-700'
  }
}

const getCellStyle = (state: CellState): React.CSSProperties => {
  switch (state) {
    case 'empty':
      return { backgroundColor: 'var(--theme-board-bg, #1a1a1a)' }
    case 'I':
      return { 
        backgroundColor: 'var(--theme-piece-I, #00ffff)',
        borderColor: 'var(--theme-piece-I, #00ffff)'
      }
    case 'O':
      return { 
        backgroundColor: 'var(--theme-piece-O, #ffff00)',
        borderColor: 'var(--theme-piece-O, #ffff00)'
      }
    case 'T':
      return { 
        backgroundColor: 'var(--theme-piece-T, #aa00ff)',
        borderColor: 'var(--theme-piece-T, #aa00ff)'
      }
    case 'S':
      return { 
        backgroundColor: 'var(--theme-piece-S, #00ff00)',
        borderColor: 'var(--theme-piece-S, #00ff00)'
      }
    case 'Z':
      return { 
        backgroundColor: 'var(--theme-piece-Z, #ff0000)',
        borderColor: 'var(--theme-piece-Z, #ff0000)'
      }
    case 'J':
      return { 
        backgroundColor: 'var(--theme-piece-J, #0066ff)',
        borderColor: 'var(--theme-piece-J, #0066ff)'
      }
    case 'L':
      return { 
        backgroundColor: 'var(--theme-piece-L, #ffaa00)',
        borderColor: 'var(--theme-piece-L, #ffaa00)'
      }
    case 'ghost':
      return { 
        borderColor: 'var(--theme-piece-ghost, #666666)',
        backgroundColor: 'transparent'
      }
    default:
      return { backgroundColor: 'var(--theme-board-bg, #1a1a1a)' }
  }
}

export const Cell = memo(function Cell({ state, className = '' }: CellProps) {
  const cellClasses = useMemo(() => getCellClasses(state), [state])
  const cellStyle = useMemo(() => getCellStyle(state), [state])
  
  return (
    <div 
      className={`
        w-6 h-6 
        border
        ${cellClasses}
        ${className}
        transition-all duration-100
      `}
      style={cellStyle}
      data-cell-type={state}
    />
  )
})

export default Cell 