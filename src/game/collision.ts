import { Board, Piece, Position, BOARD_WIDTH, BOARD_HEIGHT } from '../types/game'
import { isCellEmpty } from './board'

/**
 * Checks if a piece can be placed at a specific position
 */
export function canPlacePiece(board: Board, piece: Piece, position?: Position): boolean {
  const pos = position || piece.position
  
  // Check each filled cell in the piece matrix
  for (let py = 0; py < 4; py++) {
    for (let px = 0; px < 4; px++) {
      if (piece.matrix[py][px]) {
        const boardX = pos.x + px
        const boardY = pos.y + py
        
        // Check if position is within bounds
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return false
        }
        
        // Check if position is above the board (allow spawning above)
        if (boardY < 0) {
          continue
        }
        
        // Check if the board cell is empty
        if (!isCellEmpty(board, boardX, boardY)) {
          return false
        }
      }
    }
  }
  
  return true
}

/**
 * Checks if a piece can move in a specific direction
 */
export function canMovePiece(board: Board, piece: Piece, deltaX: number, deltaY: number): boolean {
  const newPosition: Position = {
    x: piece.position.x + deltaX,
    y: piece.position.y + deltaY,
  }
  
  return canPlacePiece(board, piece, newPosition)
}

/**
 * Moves a piece if possible, returns the new piece or null if movement is blocked
 */
export function tryMovePiece(board: Board, piece: Piece, deltaX: number, deltaY: number): Piece | null {
  if (canMovePiece(board, piece, deltaX, deltaY)) {
    return {
      ...piece,
      position: {
        x: piece.position.x + deltaX,
        y: piece.position.y + deltaY,
      },
    }
  }
  return null
}

/**
 * Finds the lowest possible position for a piece (for hard drop and ghost piece)
 */
export function getDropPosition(board: Board, piece: Piece): Position {
  let dropY = piece.position.y
  
  // Keep moving down until we hit something
  while (canMovePiece(board, piece, 0, dropY - piece.position.y + 1)) {
    dropY++
  }
  
  return {
    x: piece.position.x,
    y: dropY,
  }
}

/**
 * Checks if the game is over (new piece cannot be placed)
 */
export function isGameOver(board: Board, piece: Piece): boolean {
  return !canPlacePiece(board, piece, { x: piece.position.x, y: 0 })
}

/**
 * Places a piece on the board (returns new board with piece cells filled)
 */
export function placePieceOnBoard(board: Board, piece: Piece): Board {
  const newBoard = board.map(row => [...row])
  
  for (let py = 0; py < 4; py++) {
    for (let px = 0; px < 4; px++) {
      if (piece.matrix[py][px]) {
        const boardX = piece.position.x + px
        const boardY = piece.position.y + py
        
        // Only place if within board bounds
        if (boardX >= 0 && boardX < BOARD_WIDTH && 
            boardY >= 0 && boardY < BOARD_HEIGHT) {
          newBoard[boardY][boardX] = piece.type
        }
      }
    }
  }
  
  return newBoard
} 