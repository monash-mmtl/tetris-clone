import React from 'react'

interface GameStatsProps {
  score: number
  level: number
  lines: number
  className?: string
}

export function GameStats({ score, level, lines, className = '' }: GameStatsProps) {
  // Calculate performance metrics
  const linesUntilNextLevel = 10 - (lines % 10)
  const progressPercentage = ((lines % 10) / 10) * 100

  return (
    <div className={`bg-gray-900 p-4 rounded border border-gray-700 ${className}`}>
      <h3 className="text-retro-border font-bold mb-3">STATISTICS</h3>
      
      <div className="space-y-3">
        {/* Score */}
        <div>
          <div className="text-xs text-gray-400 uppercase">Score</div>
          <div className="text-lg font-bold text-white">
            {score.toLocaleString()}
          </div>
        </div>
        
        {/* Level */}
        <div>
          <div className="text-xs text-gray-400 uppercase">Level</div>
          <div className="text-lg font-bold text-retro-border">
            {level}
          </div>
        </div>
        
        {/* Lines */}
        <div>
          <div className="text-xs text-gray-400 uppercase">Lines</div>
          <div className="text-lg font-bold text-white">
            {lines}
          </div>
        </div>
        
        {/* Progress to next level */}
        <div>
          <div className="text-xs text-gray-400 uppercase mb-1">
            Next Level
          </div>
          <div className="text-xs text-white mb-1">
            {linesUntilNextLevel} lines to go
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-retro-border h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Additional metrics */}
        <div className="pt-2 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-gray-400">L/min</div>
              <div className="text-white font-mono">
                {level > 1 ? Math.round((lines / level) * 60) : 0}
              </div>
            </div>
            <div>
              <div className="text-gray-400">PPL</div>
              <div className="text-white font-mono">
                {lines > 0 ? Math.round(score / lines) : 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameStats 