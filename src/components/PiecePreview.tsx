import React from 'react'
import { CellState } from '../types/game'
import { PIECE_MATRICES } from '../game/pieces'

interface PiecePreviewProps {
  pieceType: Exclude<CellState, 'empty' | 'ghost'> | null
  size?: 'small' | 'medium' | 'large'
  className?: string
}

// Color mapping for pieces (matching Cell component)
const PIECE_COLORS: Record<Exclude<CellState, 'empty' | 'ghost'>, string> = {
  I: 'bg-cyan-400 border-cyan-300',
  O: 'bg-yellow-400 border-yellow-300', 
  T: 'bg-purple-400 border-purple-300',
  S: 'bg-green-400 border-green-300',
  Z: 'bg-red-400 border-red-300',
  J: 'bg-blue-400 border-blue-300',
  L: 'bg-orange-400 border-orange-300',
}

export function PiecePreview({ pieceType, size = 'small', className = '' }: PiecePreviewProps) {
  if (!pieceType) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-sm">Empty</div>
      </div>
    )
  }

  // Get the piece matrix (use rotation 0)
  const matrix = PIECE_MATRICES[pieceType][0]
  
  // Find the bounding box of the piece to center it
  let minRow = 4, maxRow = -1, minCol = 4, maxCol = -1
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (matrix[row][col]) {
        minRow = Math.min(minRow, row)
        maxRow = Math.max(maxRow, row)
        minCol = Math.min(minCol, col)
        maxCol = Math.max(maxCol, col)
      }
    }
  }

  // Calculate dimensions
  const width = maxCol - minCol + 1
  const height = maxRow - minRow + 1

  // Size configurations
  const sizeConfig = {
    small: {
      cellSize: 'w-3 h-3',
      gap: 'gap-px',
      padding: 'p-1'
    },
    medium: {
      cellSize: 'w-4 h-4', 
      gap: 'gap-px',
      padding: 'p-2'
    },
    large: {
      cellSize: 'w-6 h-6',
      gap: 'gap-1',
      padding: 'p-3'
    }
  }

  const config = sizeConfig[size]
  const pieceColor = PIECE_COLORS[pieceType]

  return (
    <div className={`flex items-center justify-center ${config.padding} ${className}`}>
      <div 
        className={`grid ${config.gap}`}
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
      >
        {Array.from({ length: height }, (_, row) =>
          Array.from({ length: width }, (_, col) => {
            const actualRow = minRow + row
            const actualCol = minCol + col
            const isActive = matrix[actualRow][actualCol]
            
            return (
              <div
                key={`${row}-${col}`}
                className={`${config.cellSize} border ${
                  isActive 
                    ? `${pieceColor} border-opacity-60 rounded-sm`
                    : 'bg-transparent'
                }`}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

export default PiecePreview 