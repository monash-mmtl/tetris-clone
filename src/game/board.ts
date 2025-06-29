import { Board, CellState, BOARD_WIDTH, BOARD_HEIGHT } from '../types/game'

/**
 * Creates an empty game board
 */
export function createEmptyBoard(): Board {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill('empty') as CellState[])
}

/**
 * Creates a copy of the board
 */
export function cloneBoard(board: Board): Board {
  return board.map(row => [...row])
}

/**
 * Checks if a position is within board bounds
 */
export function isValidPosition(x: number, y: number): boolean {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT
}

/**
 * Checks if a cell is empty
 */
export function isCellEmpty(board: Board, x: number, y: number): boolean {
  if (!isValidPosition(x, y)) return false
  return board[y][x] === 'empty'
}

/**
 * Sets a cell to a specific state
 */
export function setCell(board: Board, x: number, y: number, state: CellState): Board {
  if (!isValidPosition(x, y)) return board
  
  const newBoard = cloneBoard(board)
  newBoard[y][x] = state
  return newBoard
}

/**
 * Checks if a row is completely filled
 */
export function isRowComplete(board: Board, row: number): boolean {
  if (row < 0 || row >= BOARD_HEIGHT) return false
  return board[row].every(cell => cell !== 'empty')
}

/**
 * Finds all complete rows
 */
export function findCompleteRows(board: Board): number[] {
  const completeRows: number[] = []
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (isRowComplete(board, y)) {
      completeRows.push(y)
    }
  }
  return completeRows
}

/**
 * Clears complete rows and drops remaining rows down
 */
export function clearCompleteRows(board: Board): { newBoard: Board; clearedCount: number } {
  const completeRows = findCompleteRows(board)
  if (completeRows.length === 0) {
    return { newBoard: cloneBoard(board), clearedCount: 0 }
  }

  // Create new board without complete rows
  const newBoard = createEmptyBoard()
  let newBoardRow = BOARD_HEIGHT - 1

  // Copy non-complete rows from bottom to top
  for (let oldRow = BOARD_HEIGHT - 1; oldRow >= 0; oldRow--) {
    if (!completeRows.includes(oldRow)) {
      newBoard[newBoardRow] = [...board[oldRow]]
      newBoardRow--
    }
  }

  return { newBoard, clearedCount: completeRows.length }
} 