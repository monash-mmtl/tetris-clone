import React, { useState, useEffect } from 'react'
import { useGameStatistics } from '../hooks/useStorage'

interface GameOverScreenProps {
  score: number
  level: number
  lines: number
  isHighScore: boolean
  gameDuration: number
  piecesPlaced: Record<string, number>
  lineClearCounts: Record<string, number>
  onPlayAgain: () => void
  onMainMenu: () => void
}

export function GameOverScreen({ 
  score, 
  level, 
  lines, 
  isHighScore,
  gameDuration,
  piecesPlaced,
  lineClearCounts,
  onPlayAgain, 
  onMainMenu 
}: GameOverScreenProps) {
  const { statistics } = useGameStatistics()
  const [showAnimation, setShowAnimation] = useState(false)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setShowAnimation(true)
    
    // Show detailed stats after a delay
    const timer = setTimeout(() => setShowStats(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateTotalPieces = () => {
    return Object.values(piecesPlaced).reduce((sum, count) => sum + count, 0)
  }

  const calculatePPS = () => {
    const totalPieces = calculateTotalPieces()
    return gameDuration > 0 ? (totalPieces / gameDuration).toFixed(2) : '0.00'
  }

  const calculateLPS = () => {
    return gameDuration > 0 ? (lines / gameDuration).toFixed(2) : '0.00'
  }

  return (
    <div className={`text-center space-y-6 transition-all duration-500 ${showAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Main Title */}
      <div className="space-y-4">
        {isHighScore ? (
          <>
            <div className="text-4xl animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-yellow-400 animate-pulse">
              NEW HIGH SCORE!
            </h2>
            <div className="text-yellow-200 text-lg">
              Congratulations! You made it to the leaderboard!
            </div>
          </>
        ) : (
          <>
            <div className="text-4xl">💀</div>
            <h2 className="text-3xl font-bold text-red-400">
              GAME OVER
            </h2>
          </>
        )}
      </div>

      {/* Final Score Display */}
      <div className="bg-black/70 p-6 rounded-lg border-2 border-gray-600 space-y-3">
        <div className="text-2xl font-bold text-white">
          {score.toLocaleString()}
        </div>
        <div className="text-sm text-gray-300 space-y-1">
          <div>Level {level} • {lines} Lines Cleared</div>
          <div>Time: {formatTime(gameDuration)}</div>
        </div>
      </div>

      {/* Detailed Statistics */}
      {showStats && (
        <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700 space-y-4 animate-fade-in">
          <h3 className="text-retro-border font-bold text-lg">📊 GAME STATISTICS</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Performance Metrics */}
            <div className="space-y-2">
              <h4 className="text-gray-300 font-semibold">Performance</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pieces/sec:</span>
                  <span className="text-white">{calculatePPS()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lines/sec:</span>
                  <span className="text-white">{calculateLPS()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total pieces:</span>
                  <span className="text-white">{calculateTotalPieces()}</span>
                </div>
              </div>
            </div>

            {/* Line Clears */}
            <div className="space-y-2">
              <h4 className="text-gray-300 font-semibold">Line Clears</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Singles:</span>
                  <span className="text-white">{lineClearCounts.single || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Doubles:</span>
                  <span className="text-white">{lineClearCounts.double || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Triples:</span>
                  <span className="text-white">{lineClearCounts.triple || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">Tetrises:</span>
                  <span className="text-yellow-400 font-bold">{lineClearCounts.tetris || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Piece Distribution */}
          <div className="space-y-2">
            <h4 className="text-gray-300 font-semibold text-sm">Piece Distribution</h4>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {Object.entries(piecesPlaced).map(([piece, count]) => (
                <div key={piece} className="text-center">
                  <div className="text-gray-400">{piece}</div>
                  <div className="text-white font-bold">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Bests Comparison */}
          {statistics && (
            <div className="pt-3 border-t border-gray-700">
              <h4 className="text-gray-300 font-semibold text-sm mb-2">Session vs Personal Best</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score:</span>
                    <span className={score > statistics.bestScore ? 'text-yellow-400 font-bold' : 'text-white'}>
                      {score.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best:</span>
                    <span className="text-gray-300">{statistics.bestScore.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span className={level > statistics.bestLevel ? 'text-yellow-400 font-bold' : 'text-white'}>
                      {level}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best:</span>
                    <span className="text-gray-300">{statistics.bestLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={onPlayAgain}
          className="block mx-auto px-8 py-4 bg-retro-border text-retro-bg font-bold text-xl rounded hover:bg-retro-border/90 transition-all duration-200 transform hover:scale-105"
        >
          🎮 PLAY AGAIN
        </button>
        <button
          onClick={onMainMenu}
          className="block mx-auto px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded transition-colors"
        >
          📱 MAIN MENU
        </button>
      </div>

      {/* Motivational Message */}
      <div className="text-xs text-gray-400 italic">
        {isHighScore 
          ? "Outstanding performance! You've reached new heights!" 
          : lines > 50 
            ? "Great effort! Keep practicing to improve your score!"
            : "Every game is a chance to improve. Try again!"
        }
      </div>
    </div>
  )
}

export default GameOverScreen 