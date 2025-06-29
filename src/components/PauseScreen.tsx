import React from 'react'

interface PauseScreenProps {
  score: number
  level: number
  lines: number
  gameTime: number
  onResume: () => void
  onSettings: () => void
  onMainMenu: () => void
}

export function PauseScreen({ 
  score, 
  level, 
  lines, 
  gameTime,
  onResume, 
  onSettings, 
  onMainMenu 
}: PauseScreenProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const linesUntilNextLevel = 10 - (lines % 10)
  const progressPercentage = ((lines % 10) / 10) * 100

  return (
    <div className="text-center space-y-6">
      {/* Pause Title */}
      <div className="space-y-3">
        <div className="text-4xl">⏸️</div>
        <h2 className="text-3xl font-bold text-yellow-400 animate-pulse">
          GAME PAUSED
        </h2>
        <div className="text-gray-300">
          Take a moment to rest and strategize
        </div>
      </div>

      {/* Current Session Stats */}
      <div className="bg-black/70 p-6 rounded-lg border-2 border-gray-600 space-y-4">
        <h3 className="text-retro-border font-bold text-lg">📊 SESSION PROGRESS</h3>
        
        <div className="grid grid-cols-2 gap-6 text-sm">
          {/* Score & Level */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-400 uppercase">Score</div>
              <div className="text-xl font-bold text-white">
                {score.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase">Level</div>
              <div className="text-xl font-bold text-retro-border">
                {level}
              </div>
            </div>
          </div>

          {/* Lines & Time */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-400 uppercase">Lines</div>
              <div className="text-xl font-bold text-white">
                {lines}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase">Time</div>
              <div className="text-xl font-bold text-white">
                {formatTime(gameTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress to next level */}
        <div className="pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 uppercase mb-2">
            Progress to Level {level + 1}
          </div>
          <div className="text-sm text-white mb-2">
            {linesUntilNextLevel} lines to go
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-retro-border h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {Math.round(progressPercentage)}% complete
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onResume}
          className="block mx-auto px-8 py-4 bg-yellow-400 text-black font-bold text-xl rounded hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          ▶️ RESUME GAME
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onSettings}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded transition-colors"
          >
            ⚙️ SETTINGS
          </button>
          <button
            onClick={onMainMenu}
            className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded transition-colors"
          >
            🏠 MAIN MENU
          </button>
        </div>
      </div>

      {/* Game Tips */}
      <div className="bg-gray-900/70 p-4 rounded border border-gray-700">
        <h4 className="text-retro-border font-bold text-sm mb-2">💡 QUICK TIPS</h4>
        <div className="text-xs text-gray-300 space-y-1">
          <div>• Try to create and clear multiple lines at once for bonus points</div>
          <div>• Hold pieces strategically to set up future placements</div>
          <div>• Use the ghost piece to plan your drops accurately</div>
          <div>• Higher levels increase speed but also scoring multipliers</div>
        </div>
      </div>

      {/* Controls Reminder */}
      <div className="text-xs text-gray-400 space-y-1">
        <div>Press <span className="text-white font-bold">P</span> to resume • <span className="text-white font-bold">ESC</span> for settings</div>
        <div>Game will remain paused until you're ready to continue</div>
      </div>
    </div>
  )
}

export default PauseScreen 