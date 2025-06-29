import { Board, CellState } from '../types/game'
import { createEmptyBoard, setCell } from './board'

/**
 * Creates a demo board with some test pieces for visual testing
 */
export function createDemoBoard(): Board {
  let board = createEmptyBoard()

  // Add some demo pieces to showcase colors
  // Bottom row - mixed pieces
  board = setCell(board, 0, 19, 'I') // Cyan
  board = setCell(board, 1, 19, 'O') // Yellow
  board = setCell(board, 2, 19, 'T') // Purple
  board = setCell(board, 3, 19, 'S') // Green
  board = setCell(board, 4, 19, 'Z') // Red
  board = setCell(board, 5, 19, 'J') // Blue
  board = setCell(board, 6, 19, 'L') // Orange
  board = setCell(board, 7, 19, 'I') // Cyan
  board = setCell(board, 8, 19, 'O') // Yellow
  board = setCell(board, 9, 19, 'T') // Purple

  // Second row - partial fill
  board = setCell(board, 0, 18, 'T')
  board = setCell(board, 1, 18, 'T')
  board = setCell(board, 2, 18, 'T')
  board = setCell(board, 7, 18, 'S')
  board = setCell(board, 8, 18, 'S')
  board = setCell(board, 9, 18, 'S')

  // Create a T-piece in the middle
  board = setCell(board, 4, 15, 'T')
  board = setCell(board, 3, 16, 'T')
  board = setCell(board, 4, 16, 'T')
  board = setCell(board, 5, 16, 'T')

  // Create an I-piece vertically
  board = setCell(board, 1, 12, 'I')
  board = setCell(board, 1, 13, 'I')
  board = setCell(board, 1, 14, 'I')
  board = setCell(board, 1, 15, 'I')

  // Ghost piece preview
  board = setCell(board, 6, 10, 'ghost')
  board = setCell(board, 7, 10, 'ghost')
  board = setCell(board, 6, 11, 'ghost')
  board = setCell(board, 7, 11, 'ghost')

  return board
}

/**
 * Creates a demo board with line clearing scenario
 */
export function createLineClearDemo(): Board {
  let board = createEmptyBoard()

  // Create almost complete lines
  for (let x = 0; x < 9; x++) {
    board = setCell(board, x, 19, 'I') // Bottom row - missing one piece
    board = setCell(board, x, 18, 'O') // Second row - missing one piece
  }

  // Add some scattered pieces above
  board = setCell(board, 4, 16, 'T')
  board = setCell(board, 5, 16, 'T')
  board = setCell(board, 3, 15, 'S')
  board = setCell(board, 4, 15, 'S')

  return board
} 