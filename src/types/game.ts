// Core game constants
export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20

// Cell states
export type CellState = 
  | 'empty'
  | 'I' // Cyan - I piece
  | 'O' // Yellow - O piece  
  | 'T' // Purple - T piece
  | 'S' // Green - S piece
  | 'Z' // Red - Z piece
  | 'J' // Blue - J piece
  | 'L' // Orange - L piece
  | 'ghost' // Ghost piece preview

// Board is a 2D array representing the game grid
export type Board = CellState[][]

// Piece rotation states (0-3)
export type Rotation = 0 | 1 | 2 | 3

// Piece position on the board
export interface Position {
  x: number
  y: number
}

// Active piece in the game
export interface Piece {
  type: Exclude<CellState, 'empty' | 'ghost'>
  position: Position
  rotation: Rotation
  matrix: boolean[][] // 4x4 matrix defining the piece shape
}

// Game state
export interface GameState {
  board: Board
  activePiece: Piece | null
  nextPieces: Piece['type'][] // Queue of upcoming pieces
  holdPiece: Piece['type'] | null
  score: number
  level: number
  lines: number
  gameStatus: 'playing' | 'paused' | 'gameOver' | 'menu'
  canHold: boolean // Prevents holding multiple times per piece
}

// Game actions
export interface GameAction {
  type: 
    | 'MOVE_LEFT'
    | 'MOVE_RIGHT' 
    | 'MOVE_DOWN'
    | 'ROTATE_CW'      // Clockwise rotation
    | 'ROTATE_CCW'     // Counter-clockwise rotation
    | 'HARD_DROP'
    | 'HOLD'
    | 'PAUSE_TOGGLE'
    | 'RESTART_GAME'
    | 'TICK'
} 