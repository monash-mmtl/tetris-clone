import React from 'react'
import { CellState } from '../types/game'
import PiecePreview from './PiecePreview'

interface NextPiecesProps {
  nextPieces: (Exclude<CellState, 'empty' | 'ghost'>)[]
  maxDisplay?: number
  className?: string
}

export function NextPieces({ nextPieces, maxDisplay = 3, className = '' }: NextPiecesProps) {
  const displayPieces = nextPieces.slice(0, maxDisplay)

  return (
    <div className={`bg-gray-900 p-4 rounded border border-gray-700 ${className}`}>
      <h3 className="text-retro-border font-bold mb-3">NEXT</h3>
      
      <div className="space-y-3">
        {displayPieces.map((pieceType, index) => (
          <div 
            key={index}
            className={`
              bg-gray-800 rounded p-2 border
              ${index === 0 
                ? 'border-retro-border bg-gray-750' 
                : 'border-gray-600'
              }
            `}
          >
            {/* Piece preview */}
            <div className="flex justify-center">
              <PiecePreview 
                pieceType={pieceType} 
                size={index === 0 ? 'medium' : 'small'}
              />
            </div>
            
            {/* Piece label */}
            <div className={`
              text-center text-xs mt-1
              ${index === 0 ? 'text-retro-border font-bold' : 'text-gray-400'}
            `}>
              {index === 0 ? 'NEXT' : `+${index + 1}`}
            </div>
          </div>
        ))}
      </div>
      
      {/* Queue indicator */}
      {nextPieces.length > maxDisplay && (
        <div className="text-center text-xs text-gray-500 mt-2">
          +{nextPieces.length - maxDisplay} more
        </div>
      )}
    </div>
  )
}

export default NextPieces 