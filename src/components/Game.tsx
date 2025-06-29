import React, { useEffect, useRef, useState } from 'react'
import Board from './Board'
import GameStats from './GameStats'
import NextPieces from './NextPieces'
import HoldPiece from './HoldPiece'
import ControlsPanel from './ControlsPanel'
import { useGameStore } from '../store/gameStore'

// import { useGameInput } from '../hooks/useGameInput'
import { useGameAudio } from '../hooks/useAudio'
import { useHighScores } from '../hooks/useStorage'
import AudioControls from './AudioControls'
import HighScores from './HighScores'
import SettingsPanel from './SettingsPanel'
import GameOverScreen from './GameOverScreen'
import PauseScreen from './PauseScreen'
import CRTEffect from './CRTEffect'
import { useTheme } from '../hooks/useTheme'

export function Game() {
  const {
    board,
    activePiece,
    nextPieces,
    holdPiece,
    canHold,
    score,
    level,
    lines,
    gameStatus,
    showGhost,
    gameStartTime,
    gameDuration,
    piecesPlaced,
    lineClearCounts,
    tick,
    startGame,
    pauseGame,
    dispatch,
    resetGame,
    toggleGhost
  } = useGameStore()

  const { currentTheme } = useTheme()
  const { sounds } = useGameAudio()
  const { isHighScore } = useHighScores()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Setup game input handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for game controls
      const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'z', 'Z', 'x', 'X', 'Control', 'Shift', 'c', 'C', 'Escape']
      if (gameKeys.includes(event.key)) {
        event.preventDefault()
      }

      switch (event.key) {
        case 'ArrowLeft':
          dispatch({ type: 'MOVE_LEFT' })
          break
        case 'ArrowRight':
          dispatch({ type: 'MOVE_RIGHT' })
          break
        case 'ArrowDown':
          dispatch({ type: 'MOVE_DOWN' })
          break
        case 'ArrowUp':
        case 'x':
        case 'X':
          dispatch({ type: 'ROTATE_CW' })
          break
        case 'z':
        case 'Z':
          dispatch({ type: 'ROTATE_CCW' })
          break
        case ' ': // Space for hard drop
          dispatch({ type: 'HARD_DROP' })
          break
        case 'c':
        case 'C':
        case 'Shift':  // Support both C and Shift for hold
          dispatch({ type: 'HOLD' })
          break
        case 'Control':
          dispatch({ type: 'HARD_DROP' })
          break
        case 'p':
        case 'P':
          dispatch({ type: 'PAUSE_TOGGLE' })
          break
        case 'Escape':
          if (gameStatus === 'playing') {
            dispatch({ type: 'PAUSE_TOGGLE' })
          } else if (gameStatus === 'paused') {
            dispatch({ type: 'PAUSE_TOGGLE' })
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch])

  // Start the 60 FPS game loop
  const gameLoopRef = useRef<number>()
  
  useEffect(() => {
    if (gameStatus === 'playing') {
      const loop = () => {
        tick()
        gameLoopRef.current = requestAnimationFrame(loop)
      }
      gameLoopRef.current = requestAnimationFrame(loop)
      
      return () => {
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current)
        }
      }
    }
  }, [gameStatus, tick])
  
  // Start/stop background music based on game state
  useEffect(() => {
    if (gameStatus === 'playing') {
      // Start some ambient background music
      sounds.startMenuMusic()
    } else {
      // Stop music when not playing
      sounds.stopMenuMusic()
    }
  }, [gameStatus, sounds])



  const renderGameOverlay = () => {
    switch (gameStatus) {      
      case 'gameOver':
        return (
          <GameOverScreen
            score={score}
            level={level}
            lines={lines}
            isHighScore={isHighScore(score)}
            gameDuration={gameDuration}
            piecesPlaced={piecesPlaced}
            lineClearCounts={lineClearCounts}
            onPlayAgain={() => dispatch({ type: 'RESTART_GAME' })}
            onMainMenu={resetGame}
          />
        )
      
      default:
        return null
    }
  }

  if (gameStatus === 'menu') {
    return (
      <CRTEffect 
        enabled={currentTheme.effects.scanlines || currentTheme.effects.crtCurve}
        className="min-h-screen"
      >
        <div 
          className="min-h-screen p-4 transition-colors duration-500"
          style={{ backgroundColor: `var(--theme-primary, #0f380f)` }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left side - Main menu */}
              <div className="text-center space-y-8 p-8">
                <h1 
                  className="text-6xl font-bold mb-4 transition-colors duration-500"
                  style={{ color: `var(--theme-text, #9bbc0f)` }}
                >
                  TETRIS
                </h1>
                <p 
                  className="text-xl mb-8 transition-colors duration-500"
                  style={{ color: `var(--theme-text-secondary, #8bac0f)` }}
                >
                  Retro 8-bit Style
                </p>
                
                {/* Audio controls in menu */}
                <div className="flex justify-center mb-6">
                  <AudioControls size="large" />
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={startGame}
                    className="block mx-auto px-8 py-4 font-bold text-xl rounded hover:opacity-90 transition-all duration-200 transform hover:scale-105"
                    style={{ 
                      backgroundColor: `var(--theme-accent, #8bac0f)`,
                      color: `var(--theme-primary, #0f380f)`
                    }}
                  >
                    START GAME
                  </button>
                  
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="block mx-auto px-8 py-4 font-bold text-xl rounded border-2 transition-all duration-200 transform hover:scale-105"
                    style={{ 
                      borderColor: `var(--theme-accent, #8bac0f)`,
                      color: `var(--theme-accent, #8bac0f)`,
                      backgroundColor: 'transparent'
                    }}
                  >
                    SETTINGS
                  </button>
                </div>
                
                {/* Enhanced Instructions */}
                <div 
                  className="text-sm space-y-1 mt-8 p-4 rounded border transition-all duration-500"
                  style={{ 
                    borderColor: `var(--theme-accent, #8bac0f)`,
                    backgroundColor: `var(--theme-secondary, #306230)`,
                    color: `var(--theme-text-secondary, #8bac0f)`
                  }}
                >
                                     <p><strong>CONTROLS:</strong></p>
                   <p>← → ↓ Move • ↑/X Rotate • Space Drop • C/Shift Hold • P/ESC Pause</p>
                  <p><strong>Current Theme:</strong> {currentTheme.displayName}</p>
                </div>
              </div>
              
              {/* Right side - High scores */}
              <div className="space-y-6">
                <HighScores />
              </div>
            </div>
          </div>
        </div>
      </CRTEffect>
    )
  }

  return (
    <CRTEffect 
      enabled={currentTheme.effects.scanlines || currentTheme.effects.crtCurve}
      className="min-h-screen"
    >
      <div 
        className="min-h-screen p-4 transition-colors duration-500"
        style={{ backgroundColor: `var(--theme-primary, #0f380f)` }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         {/* Left panel - Game stats and controls */}
             <div className="lg:col-span-1 space-y-4">
               <GameStats 
                 score={score}
                 level={level}
                 lines={lines}
               />
               <HoldPiece holdPiece={holdPiece} canHold={canHold} />
               <ControlsPanel 
                 showGhost={showGhost}
                 onToggleGhost={toggleGhost}
               />
               <AudioControls />
             </div>
             
             {/* Center - Game board */}
             <div className="lg:col-span-1 flex justify-center">
               <Board 
                 board={board} 
                 activePiece={activePiece} 
                 showGhost={showGhost}
               />
             </div>
             
             {/* Right panel - Next pieces and additional info */}
             <div className="lg:col-span-1 space-y-4">
               <NextPieces nextPieces={nextPieces} maxDisplay={3} />
               <HighScores maxEntries={5} />
             </div>
          </div>
        </div>

                 {/* Game status overlays */}
         {renderGameOverlay()}
         
         {/* Pause Menu Overlay */}
         {gameStatus === 'paused' && (
           <div className="fixed inset-0 z-50 flex items-center justify-center">
             <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
             <div className="relative z-10">
               <PauseScreen
                 score={score}
                 level={level}
                 lines={lines}
                 gameTime={gameDuration}
                 onResume={() => dispatch({ type: 'PAUSE_TOGGLE' })}
                 onSettings={() => setIsSettingsOpen(true)}
                 onMainMenu={resetGame}
               />
             </div>
           </div>
         )}
         
         {/* Settings panel */}
         {isSettingsOpen && (
           <SettingsPanel
             isOpen={isSettingsOpen}
             onClose={() => setIsSettingsOpen(false)}
           />
         )}
      </div>
    </CRTEffect>
  )
}

export default Game 