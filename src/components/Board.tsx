import React, { memo, useMemo } from 'react'
import { Board as BoardType, Piece, BOARD_WIDTH, BOARD_HEIGHT } from '../types/game'
import { getDropPosition } from '../game/collision'
import Cell from './Cell'

interface BoardProps {
  board: BoardType
  activePiece?: Piece | null
  showGhost?: boolean
  className?: string
}

/**
 * Creates a visual board that combines the base board with the active piece and ghost piece
 */
function createVisualBoard(board: BoardType, activePiece?: Piece | null, showGhost: boolean = true): BoardType {
  // Start with a copy of the base board
  const visualBoard = board.map(row => [...row])
  
  // Add ghost piece first (so active piece will render on top)
  if (showGhost && activePiece) {
    const dropPosition = getDropPosition(board, activePiece)
    
    // Only show ghost if it's different from current position
    if (dropPosition.y !== activePiece.position.y) {
      for (let py = 0; py < 4; py++) {
        for (let px = 0; px < 4; px++) {
          if (activePiece.matrix[py][px]) {
            const boardX = dropPosition.x + px
            const boardY = dropPosition.y + py
            
            // Only draw if within board bounds and cell is empty
            if (boardX >= 0 && boardX < BOARD_WIDTH && 
                boardY >= 0 && boardY < BOARD_HEIGHT &&
                visualBoard[boardY][boardX] === 'empty') {
              visualBoard[boardY][boardX] = 'ghost'
            }
          }
        }
      }
    }
  }
  
  // Overlay the active piece if it exists (renders on top of ghost)
  if (activePiece) {
    for (let py = 0; py < 4; py++) {
      for (let px = 0; px < 4; px++) {
        if (activePiece.matrix[py][px]) {
          const boardX = activePiece.position.x + px
          const boardY = activePiece.position.y + py
          
          // Only draw if within board bounds
          if (boardX >= 0 && boardX < BOARD_WIDTH && 
              boardY >= 0 && boardY < BOARD_HEIGHT &&
              (visualBoard[boardY][boardX] === 'empty' || visualBoard[boardY][boardX] === 'ghost')) {
            visualBoard[boardY][boardX] = activePiece.type
          }
        }
      }
    }
  }
  
  return visualBoard
}

export const Board = memo(function Board({ board, activePiece, showGhost = true, className = '' }: BoardProps) {
  const visualBoard = useMemo(() => 
    createVisualBoard(board, activePiece, showGhost),
    [board, activePiece, showGhost]
  )
  
  return (
    <div 
      className={`
        inline-block 
        p-2 
        bg-black 
        border-4 
        border-retro-border 
        rounded-lg 
        shadow-2xl
        ${className}
      `}
    >
      {/* Board grid */}
      <div 
        className="grid gap-px bg-gray-800 p-1"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
        }}
      >
        {visualBoard.map((row, y) =>
          row.map((cellState, x) => (
            <Cell
              key={`${x}-${y}`}
              state={cellState}
              className="cell"
            />
          ))
        )}
      </div>
      
      {/* Board dimensions info for debugging */}
      <div className="text-xs text-gray-500 text-center mt-1">
        {BOARD_WIDTH} × {BOARD_HEIGHT}
      </div>
    </div>
  )
})

export default Board 