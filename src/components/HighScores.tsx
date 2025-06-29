import React from 'react'
import { useHighScores } from '../hooks/useStorage'
import { HighScore } from '../utils/storage'

interface HighScoresProps {
  className?: string
  showTitle?: boolean
  maxEntries?: number
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function HighScores({ className = '', showTitle = true, maxEntries = 10 }: HighScoresProps) {
  const { highScores, isLoading, clearHighScores } = useHighScores()

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-4">
          <div className="text-retro-text/60">Loading scores...</div>
        </div>
      </div>
    )
  }

  const displayScores = highScores.slice(0, maxEntries)

  if (displayScores.length === 0) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <h2 className="text-xl font-bold text-retro-border mb-4 text-center">
            🏆 HIGH SCORES
          </h2>
        )}
        <div className="text-center py-8">
          <div className="text-retro-text/60 mb-2">No high scores yet!</div>
          <div className="text-sm text-retro-text/40">Play a game to set your first record</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-retro-border">
            🏆 HIGH SCORES
          </h2>
          {displayScores.length > 0 && (
            <button
              onClick={clearHighScores}
              className="text-xs px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-white transition-colors"
              title="Clear all high scores"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className="space-y-2">
        {displayScores.map((score: HighScore, index: number) => (
          <div
            key={score.id}
            className={`
              p-3 rounded border transition-colors
              ${index === 0 
                ? 'bg-yellow-900/30 border-yellow-400 text-yellow-200' 
                : index === 1
                ? 'bg-gray-700/30 border-gray-400 text-gray-200'
                : index === 2
                ? 'bg-orange-900/30 border-orange-600 text-orange-200'
                : 'bg-retro-bg/50 border-gray-600 text-retro-text'
              }
            `}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${index === 0 
                    ? 'bg-yellow-400 text-black' 
                    : index === 1
                    ? 'bg-gray-400 text-black'
                    : index === 2
                    ? 'bg-orange-400 text-black'
                    : 'bg-gray-600 text-white'
                  }
                `}>
                  {index + 1}
                </div>
                
                <div>
                  <div className="font-bold text-lg">
                    {score.score.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-75">
                    Level {score.level} • {score.lines} lines
                  </div>
                </div>
              </div>
              
              <div className="text-right text-sm opacity-75">
                <div>{formatDate(score.date)}</div>
                <div>{formatDuration(score.duration)}</div>
              </div>
            </div>
            
            {/* Rank badges for top 3 */}
            {index < 3 && (
              <div className="mt-2 text-xs">
                {index === 0 && '🥇 Champion'}
                {index === 1 && '🥈 Runner-up'}
                {index === 2 && '🥉 Third Place'}
              </div>
            )}
          </div>
        ))}
      </div>

      {highScores.length > maxEntries && (
        <div className="text-center mt-4 text-sm text-retro-text/60">
          Showing top {maxEntries} of {highScores.length} scores
        </div>
      )}
    </div>
  )
}

export default HighScores 