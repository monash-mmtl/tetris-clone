import { create } from 'zustand'
import { GameState, GameAction, Piece } from '../types/game'
import { createEmptyBoard, clearCompleteRows } from '../game/board'
import { createPiece, SevenBagGenerator } from '../game/pieces'
import { canMovePiece, tryMovePiece, placePieceOnBoard, getDropPosition, isGameOver } from '../game/collision'
import { tryRotateClockwise, tryRotateCounterClockwise } from '../game/rotation'
import { playSound } from '../audio/sounds'
import { storage } from '../utils/storage'
interface GameStore extends GameState {
  // Actions
  dispatch: (action: GameAction) => void
  resetGame: () => void
  startGame: () => void
  pauseGame: () => void
  
  // Game loop
  tick: () => void
  lockPiece: (piece: Piece) => void
  
  // Settings
  showGhost: boolean
  toggleGhost: () => void
  
  // Internal state
  pieceGenerator: SevenBagGenerator
  dropTimer: number
  dropInterval: number // ms between drops
  
  // Game tracking for statistics
  gameStartTime: number
  gameDuration: number
  piecesPlaced: Record<string, number>
  lineClearCounts: Record<string, number>
}

const INITIAL_DROP_INTERVAL = 1000 // 1 second for level 1
const DROP_SPEED_INCREASE = 0.9 // Each level is 10% faster

/**
 * Calculates drop interval based on level
 */
function getDropInterval(level: number): number {
  return Math.max(50, INITIAL_DROP_INTERVAL * Math.pow(DROP_SPEED_INCREASE, level - 1))
}

/**
 * Creates initial game state
 */
function createInitialState(): Omit<GameStore, 'dispatch' | 'resetGame' | 'startGame' | 'pauseGame' | 'tick' | 'lockPiece' | 'toggleGhost'> {
  const generator = new SevenBagGenerator()
  const firstPieceType = generator.getNext()
  
  return {
    board: createEmptyBoard(),
    activePiece: createPiece(firstPieceType),
    nextPieces: generator.getQueue(3), // Show next 3 pieces
    holdPiece: null,
    score: 0,
    level: 1,
    lines: 0,
    gameStatus: 'menu',
    canHold: true,
    pieceGenerator: generator,
    dropTimer: 0,
    dropInterval: getDropInterval(1),
    gameStartTime: Date.now(),
    gameDuration: 0,
    piecesPlaced: { I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0 },
    lineClearCounts: { single: 0, double: 0, triple: 0, tetris: 0 },
    showGhost: true, // Default to showing ghost piece
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),
  
  dispatch: (action: GameAction) => {
    const state = get()
    
    if (state.gameStatus !== 'playing') {
      if (action.type === 'PAUSE_TOGGLE' && state.gameStatus === 'paused') {
        set({ gameStatus: 'playing' })
      }
      return
    }
    
    switch (action.type) {
      case 'MOVE_LEFT':
        if (state.activePiece) {
          const newPiece = tryMovePiece(state.board, state.activePiece, -1, 0)
          if (newPiece) {
            set({ activePiece: newPiece })
            playSound('move')
          }
        }
        break
        
      case 'MOVE_RIGHT':
        if (state.activePiece) {
          const newPiece = tryMovePiece(state.board, state.activePiece, 1, 0)
          if (newPiece) {
            set({ activePiece: newPiece })
            playSound('move')
          }
        }
        break
        
      case 'MOVE_DOWN':
        if (state.activePiece) {
          const newPiece = tryMovePiece(state.board, state.activePiece, 0, 1)
          if (newPiece) {
            set({ activePiece: newPiece })
            playSound('move')
          }
        }
        break
        
      case 'ROTATE_CW':
        if (state.activePiece) {
          const newPiece = tryRotateClockwise(state.board, state.activePiece)
          if (newPiece) {
            set({ activePiece: newPiece })
            playSound('rotate')
          }
        }
        break
        
      case 'ROTATE_CCW':
        if (state.activePiece) {
          const newPiece = tryRotateCounterClockwise(state.board, state.activePiece)
          if (newPiece) {
            set({ activePiece: newPiece })
            playSound('rotate')
          }
        }
        break
        
      case 'HOLD':
        if (state.activePiece && state.canHold) {
          const currentPiece = state.activePiece
          let newActivePiece: Piece
          let newHoldPiece = currentPiece.type
          
          if (state.holdPiece) {
            // Swap current piece with held piece
            newActivePiece = createPiece(state.holdPiece)
          } else {
            // No held piece, take next piece
            newActivePiece = createPiece(state.nextPieces[0])
            const newNextPieces = [...state.nextPieces.slice(1), state.pieceGenerator.getNext()]
            set({ nextPieces: newNextPieces })
          }
          
          set({
            activePiece: newActivePiece,
            holdPiece: newHoldPiece,
            canHold: false // Can't hold again until next piece
          })
          
          playSound('rotate') // Use rotate sound for hold
        }
        break
        
      case 'HARD_DROP':
        if (state.activePiece) {
          const dropPos = getDropPosition(state.board, state.activePiece)
          const droppedPiece = { ...state.activePiece, position: dropPos }
          playSound('drop')
          get().lockPiece(droppedPiece)
        }
        break
        
      case 'PAUSE_TOGGLE':
        set({ gameStatus: state.gameStatus === 'playing' ? 'paused' : 'playing' })
        break
        
      case 'RESTART_GAME':
        get().resetGame()
        break
        
      case 'TICK':
        get().tick()
        break
    }
  },
  
  resetGame: () => {
    set(createInitialState())
  },
  
  startGame: () => {
    const newState = createInitialState()
    set({ ...newState, gameStatus: 'playing', gameStartTime: Date.now() })
  },
  
  pauseGame: () => {
    set({ gameStatus: 'paused' })
  },
  
  tick: () => {
    const state = get()
    
    if (state.gameStatus !== 'playing' || !state.activePiece) {
      return
    }
    
    // Update game duration
    const currentTime = Date.now()
    const newGameDuration = Math.floor((currentTime - state.gameStartTime) / 1000)
    
    const newDropTimer = state.dropTimer + 16.67 // ~60 FPS
    
    if (newDropTimer >= state.dropInterval) {
      // Time to drop the piece
      const newPiece = tryMovePiece(state.board, state.activePiece, 0, 1)
      
      if (newPiece) {
        // Piece can move down
        set({ 
          activePiece: newPiece,
          dropTimer: 0,
          gameDuration: newGameDuration
        })
      } else {
        // Piece is blocked, lock it in place
        get().lockPiece(state.activePiece)
      }
    } else {
      set({ 
        dropTimer: newDropTimer,
        gameDuration: newGameDuration
      })
    }
  },
  
  // Helper function to lock a piece and spawn the next one
  lockPiece: (piece: Piece) => {
    const state = get()
    
    // Play lock sound
    playSound('lock')
    
    // Track piece placement statistics
    const newPiecesPlaced = {
      ...state.piecesPlaced,
      [piece.type]: state.piecesPlaced[piece.type] + 1
    }
    
    // Place piece on board
    let newBoard = placePieceOnBoard(state.board, piece)
    
    // Clear completed lines
    const { newBoard: clearedBoard, clearedCount } = clearCompleteRows(newBoard)
    
    // Track line clear statistics
    const newLineClearCounts = { ...state.lineClearCounts }
    if (clearedCount === 1) newLineClearCounts.single++
    else if (clearedCount === 2) newLineClearCounts.double++
    else if (clearedCount === 3) newLineClearCounts.triple++
    else if (clearedCount === 4) newLineClearCounts.tetris++
    
    // Play line clear sound if lines were cleared
    if (clearedCount > 0) {
      playSound('lineClear', { lines: clearedCount })
    }
    
    // Update score and level
    const lineScore = [0, 40, 100, 300, 1200][clearedCount] * state.level
    const newLines = state.lines + clearedCount
    const newLevel = Math.floor(newLines / 10) + 1
    const newScore = state.score + lineScore
    
    // Play level up sound if level increased
    if (newLevel > state.level) {
      playSound('levelUp')
    }
    
    // Spawn next piece
    const nextPieceType = state.nextPieces[0]
    const newActivePiece = createPiece(nextPieceType)
    const newNextPieces = [...state.nextPieces.slice(1), state.pieceGenerator.getNext()]
    
    // Check game over
    if (isGameOver(clearedBoard, newActivePiece)) {
      playSound('gameOver')
      
      // Record game completion in storage
      const gameDuration = Math.floor((Date.now() - state.gameStartTime) / 1000)
      storage.recordGameCompletion({
        score: newScore,
        level: newLevel,
        lines: newLines,
        duration: gameDuration,
        pieces: newPiecesPlaced,
        lineClears: newLineClearCounts
      })
      
      set({ 
        gameStatus: 'gameOver',
        board: clearedBoard,
        score: newScore,
        lines: newLines,
        level: newLevel,
        piecesPlaced: newPiecesPlaced,
        lineClearCounts: newLineClearCounts
      })
      return
    }
    
    // Update state
    set({
      board: clearedBoard,
      activePiece: newActivePiece,
      nextPieces: newNextPieces,
      score: newScore,
      lines: newLines,
      level: newLevel,
      dropTimer: 0,
      dropInterval: getDropInterval(newLevel),
      canHold: true,
      piecesPlaced: newPiecesPlaced,
      lineClearCounts: newLineClearCounts
    })
  },

  toggleGhost: () => {
    const state = get()
    set({ showGhost: !state.showGhost })
  },
})) 