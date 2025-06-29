import React from 'react'
import { CellState } from '../types/game'
import PiecePreview from './PiecePreview'

interface HoldPieceProps {
  holdPiece: Exclude<CellState, 'empty' | 'ghost'> | null
  canHold: boolean
  className?: string
}

export function HoldPiece({ holdPiece, canHold, className = '' }: HoldPieceProps) {
  return (
    <div className={`bg-gray-900 p-4 rounded border border-gray-700 ${className}`}>
      <h3 className="text-retro-border font-bold mb-3">HOLD</h3>
      
      <div 
        className={`
          bg-gray-800 rounded p-3 border-2 transition-all duration-200
          ${canHold 
            ? 'border-gray-600 hover:border-gray-500' 
            : 'border-red-400 bg-gray-850'
          }
        `}
      >
        {/* Piece preview */}
        <div className="flex justify-center mb-2">
          <PiecePreview 
            pieceType={holdPiece} 
            size="medium"
            className={canHold ? '' : 'opacity-50'}
          />
        </div>
        
        {/* Status indicator */}
        <div className="text-center">
          {holdPiece ? (
            <div className={`text-xs ${canHold ? 'text-white' : 'text-red-400'}`}>
              {canHold ? 'Ready' : 'Used'}
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              Press C
            </div>
          )}
        </div>
      </div>
      
      {/* Hold instructions */}
      <div className="text-xs text-gray-400 text-center mt-2">
        {!holdPiece ? 'Hold current piece' : canHold ? 'Swap pieces' : 'Wait for next piece'}
      </div>
    </div>
  )
}

export default HoldPiece 