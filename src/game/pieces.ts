import { Piece, CellState, Rotation } from '../types/game'

// Tetris piece matrices (4x4 grids, true = filled cell)
// Each piece has 4 rotation states (0, 1, 2, 3)
export const PIECE_MATRICES: Record<Exclude<CellState, 'empty' | 'ghost'>, boolean[][][]> = {
  I: [
    // Rotation 0: Horizontal
    [
      [false, false, false, false],
      [true,  true,  true,  true ],
      [false, false, false, false],
      [false, false, false, false],
    ],
    // Rotation 1: Vertical
    [
      [false, false, true,  false],
      [false, false, true,  false],
      [false, false, true,  false],
      [false, false, true,  false],
    ],
    // Rotation 2: Horizontal (same as 0)
    [
      [false, false, false, false],
      [true,  true,  true,  true ],
      [false, false, false, false],
      [false, false, false, false],
    ],
    // Rotation 3: Vertical (same as 1)
    [
      [false, false, true,  false],
      [false, false, true,  false],
      [false, false, true,  false],
      [false, false, true,  false],
    ],
  ],
  
  O: [
    // All rotations are the same for O-piece
    [
      [false, false, false, false],
      [false, true,  true,  false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
    [
      [false, false, false, false],
      [false, true,  true,  false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
    [
      [false, false, false, false],
      [false, true,  true,  false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
    [
      [false, false, false, false],
      [false, true,  true,  false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
  ],
  
  T: [
    // Rotation 0: T pointing up
    [
      [false, false, false, false],
      [false, true,  false, false],
      [true,  true,  true,  false],
      [false, false, false, false],
    ],
    // Rotation 1: T pointing right
    [
      [false, false, false, false],
      [false, true,  false, false],
      [false, true,  true,  false],
      [false, true,  false, false],
    ],
    // Rotation 2: T pointing down
    [
      [false, false, false, false],
      [false, false, false, false],
      [true,  true,  true,  false],
      [false, true,  false, false],
    ],
    // Rotation 3: T pointing left
    [
      [false, false, false, false],
      [false, true,  false, false],
      [true,  true,  false, false],
      [false, true,  false, false],
    ],
  ],
  
  S: [
    // Rotation 0: S shape
    [
      [false, false, false, false],
      [false, true,  true,  false],
      [true,  true,  false, false],
      [false, false, false, false],
    ],
    // Rotation 1: S vertical
    [
      [false, false, false, false],
      [false, true,  false, false],
      [false, true,  true,  false],
      [false, false, true,  false],
    ],
    // Rotation 2: S shape (same as 0)
    [
      [false, false, false, false],
      [false, true,  true,  false],
      [true,  true,  false, false],
      [false, false, false, false],
    ],
    // Rotation 3: S vertical (same as 1)
    [
      [false, false, false, false],
      [false, true,  false, false],
      [false, true,  true,  false],
      [false, false, true,  false],
    ],
  ],
  
  Z: [
    // Rotation 0: Z shape
    [
      [false, false, false, false],
      [true,  true,  false, false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
    // Rotation 1: Z vertical
    [
      [false, false, false, false],
      [false, false, true,  false],
      [false, true,  true,  false],
      [false, true,  false, false],
    ],
    // Rotation 2: Z shape (same as 0)
    [
      [false, false, false, false],
      [true,  true,  false, false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
    // Rotation 3: Z vertical (same as 1)
    [
      [false, false, false, false],
      [false, false, true,  false],
      [false, true,  true,  false],
      [false, true,  false, false],
    ],
  ],
  
  J: [
    // Rotation 0: J shape
    [
      [false, false, false, false],
      [true,  false, false, false],
      [true,  true,  true,  false],
      [false, false, false, false],
    ],
    // Rotation 1: J rotated
    [
      [false, false, false, false],
      [false, true,  true,  false],
      [false, true,  false, false],
      [false, true,  false, false],
    ],
    // Rotation 2: J inverted
    [
      [false, false, false, false],
      [false, false, false, false],
      [true,  true,  true,  false],
      [false, false, true,  false],
    ],
    // Rotation 3: J rotated left
    [
      [false, false, false, false],
      [false, true,  false, false],
      [false, true,  false, false],
      [true,  true,  false, false],
    ],
  ],
  
  L: [
    // Rotation 0: L shape
    [
      [false, false, false, false],
      [false, false, true,  false],
      [true,  true,  true,  false],
      [false, false, false, false],
    ],
    // Rotation 1: L rotated
    [
      [false, false, false, false],
      [false, true,  false, false],
      [false, true,  false, false],
      [false, true,  true,  false],
    ],
    // Rotation 2: L inverted
    [
      [false, false, false, false],
      [false, false, false, false],
      [true,  true,  true,  false],
      [true,  false, false, false],
    ],
    // Rotation 3: L rotated left
    [
      [false, false, false, false],
      [true,  true,  false, false],
      [false, true,  false, false],
      [false, true,  false, false],
    ],
  ],
}

/**
 * Creates a new piece at the spawn position
 */
export function createPiece(type: Exclude<CellState, 'empty' | 'ghost'>): Piece {
  return {
    type,
    position: { x: 3, y: 0 }, // Spawn in middle-top of board
    rotation: 0,
    matrix: PIECE_MATRICES[type][0], // Start with rotation 0
  }
}

/**
 * Rotates a piece clockwise
 */
export function rotatePiece(piece: Piece, clockwise: boolean = true): Piece {
  const newRotation = clockwise 
    ? ((piece.rotation + 1) % 4) as Rotation
    : ((piece.rotation + 3) % 4) as Rotation // +3 = -1 in mod 4

  return {
    ...piece,
    rotation: newRotation,
    matrix: PIECE_MATRICES[piece.type][newRotation],
  }
}

/**
 * 7-bag random generator for fair piece distribution
 */
export class SevenBagGenerator {
  private bag: (Exclude<CellState, 'empty' | 'ghost'>)[] = []
  
  private getAllPieceTypes(): (Exclude<CellState, 'empty' | 'ghost'>)[] {
    return ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
  }
  
  private shuffleBag(): void {
    this.bag = [...this.getAllPieceTypes()]
    // Fisher-Yates shuffle
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]]
    }
  }
  
  public getNext(): Exclude<CellState, 'empty' | 'ghost'> {
    if (this.bag.length === 0) {
      this.shuffleBag()
    }
    return this.bag.pop()!
  }
  
  public getQueue(length: number): (Exclude<CellState, 'empty' | 'ghost'>)[] {
    const queue: (Exclude<CellState, 'empty' | 'ghost'>)[] = []
    for (let i = 0; i < length; i++) {
      queue.push(this.getNext())
    }
    return queue
  }
} 