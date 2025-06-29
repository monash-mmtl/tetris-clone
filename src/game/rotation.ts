import { Piece, Position, CellState, Rotation } from '../types/game'
import { rotatePiece } from './pieces'
import { canPlacePiece } from './collision'
import { Board } from '../types/game'

// SRS (Super Rotation System) kick tables
// These define the offset tests to try when rotation is blocked
interface KickTable {
  [key: string]: Position[]
}

// Kick tables for JLSTZ pieces (standard pieces)
const JLSTZ_KICKS: KickTable = {
  '0->1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  '1->0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  '1->2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  '2->1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  '2->3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '3->2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '3->0': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '0->3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
}

// Kick tables for I piece (has different behavior)
const I_KICKS: KickTable = {
  '0->1': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
  '1->0': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
  '1->2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
  '2->1': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
  '2->3': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
  '3->2': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
  '3->0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
  '0->3': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
}

/**
 * Gets the appropriate kick table for a piece type
 */
function getKickTable(pieceType: Exclude<CellState, 'empty' | 'ghost'>): KickTable {
  return pieceType === 'I' ? I_KICKS : JLSTZ_KICKS
}

/**
 * Gets the kick key for rotation transition
 */
function getKickKey(fromRotation: Rotation, toRotation: Rotation): string {
  return `${fromRotation}->${toRotation}`
}

/**
 * Attempts to rotate a piece using SRS kick tables
 * Returns the rotated piece if successful, null if rotation is blocked
 */
export function tryRotatePiece(
  board: Board, 
  piece: Piece, 
  clockwise: boolean = true
): Piece | null {
  // O piece doesn't need rotation (all rotations are identical)
  if (piece.type === 'O') {
    return piece
  }

  // Get the rotated piece (without position adjustment)
  const rotatedPiece = rotatePiece(piece, clockwise)
  
  // Get kick table and kick key
  const kickTable = getKickTable(piece.type)
  const kickKey = getKickKey(piece.rotation, rotatedPiece.rotation)
  const kicks = kickTable[kickKey] || [{ x: 0, y: 0 }]
  
  // Try each kick offset
  for (const kick of kicks) {
    const testPosition: Position = {
      x: piece.position.x + kick.x,
      y: piece.position.y + kick.y,
    }
    
    const testPiece: Piece = {
      ...rotatedPiece,
      position: testPosition,
    }
    
    // Check if this position is valid
    if (canPlacePiece(board, testPiece)) {
      return testPiece
    }
  }
  
  // All kicks failed, rotation is blocked
  return null
}

/**
 * Attempts to rotate a piece clockwise
 */
export function tryRotateClockwise(board: Board, piece: Piece): Piece | null {
  return tryRotatePiece(board, piece, true)
}

/**
 * Attempts to rotate a piece counter-clockwise  
 */
export function tryRotateCounterClockwise(board: Board, piece: Piece): Piece | null {
  return tryRotatePiece(board, piece, false)
} 