import React from 'react'

interface ControlsPanelProps {
  compact?: boolean
  className?: string
  showGhost?: boolean
  onToggleGhost?: () => void
}

export function ControlsPanel({ 
  compact = false, 
  className = '', 
  showGhost, 
  onToggleGhost 
}: ControlsPanelProps) {
  const controls = [
    { keys: '← →', action: 'Move' },
    { keys: '↓', action: 'Soft Drop' },
    { keys: '↑ X', action: 'Rotate CW' },
    { keys: 'Z', action: 'Rotate CCW' },
    { keys: 'C', action: 'Hold' },
    { keys: 'Space', action: 'Hard Drop' },
    { keys: 'P ESC', action: 'Pause' },
  ]

  if (compact) {
    return (
      <div className={`bg-gray-900 p-3 rounded border border-gray-700 ${className}`}>
        <h3 className="text-retro-border font-bold text-sm mb-2">CONTROLS</h3>
        <div className="grid grid-cols-1 gap-1 text-xs">
          {controls.map(({ keys, action }, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-300 font-mono">{keys}</span>
              <span className="text-gray-400">{action}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-900 p-4 rounded border border-gray-700 ${className}`}>
      <h3 className="text-retro-border font-bold mb-3">CONTROLS</h3>
      <div className="space-y-2">
        {controls.map(({ keys, action }, index) => (
          <div key={index} className="flex items-center justify-between py-1">
            <div className="flex space-x-1">
              {keys.split(' ').map((key, keyIndex) => (
                <kbd 
                  key={keyIndex}
                  className="px-2 py-1 text-xs font-mono bg-gray-800 border border-gray-600 rounded shadow-sm"
                >
                  {key}
                </kbd>
              ))}
            </div>
            <span className="text-sm text-gray-300">{action}</span>
          </div>
        ))}
      </div>
      
      {/* Quality of Life Settings */}
      {showGhost !== undefined && onToggleGhost && (
        <div className="mt-4 pt-3 border-t border-gray-700">
          <h4 className="text-retro-border font-bold text-sm mb-2">SETTINGS</h4>
          <div className="text-xs text-gray-400 mb-2">
            💡 Pause game to access full settings menu
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">👻 Ghost Piece</span>
            <button
              onClick={onToggleGhost}
              className={`
                px-2 py-1 text-xs font-bold rounded transition-colors
                ${showGhost 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-gray-300'
                }
              `}
            >
              {showGhost ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlsPanel 