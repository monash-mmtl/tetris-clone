import React from 'react'
import { useTheme } from '../hooks/useTheme'

interface ThemeSelectorProps {
  className?: string
  showPreview?: boolean
}

export function ThemeSelector({ className = '', showPreview = true }: ThemeSelectorProps) {
  const { currentTheme, availableThemes, changeTheme } = useTheme()

  const handleThemeChange = (themeId: string) => {
    changeTheme(themeId)
  }

  const renderThemePreview = (theme: any) => {
    return (
      <div className="flex space-x-1 mt-1">
        <div 
          className="w-3 h-3 rounded-sm border border-gray-400"
          style={{ backgroundColor: theme.colors.pieces.I }}
        />
        <div 
          className="w-3 h-3 rounded-sm border border-gray-400"
          style={{ backgroundColor: theme.colors.pieces.O }}
        />
        <div 
          className="w-3 h-3 rounded-sm border border-gray-400"
          style={{ backgroundColor: theme.colors.pieces.T }}
        />
        <div 
          className="w-3 h-3 rounded-sm border border-gray-400"
          style={{ backgroundColor: theme.colors.pieces.S }}
        />
      </div>
    )
  }

  return (
    <div className={`theme-selector ${className}`}>
      <h4 className="text-sm font-bold mb-3 text-gray-300">🎨 THEME</h4>
      
      <div className="space-y-2">
        {availableThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`
              w-full text-left p-3 rounded border transition-all duration-200
              ${currentTheme.id === theme.id
                ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
              }
            `}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  {theme.displayName}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {theme.description}
                </div>
                {showPreview && renderThemePreview(theme)}
              </div>
              
              {/* Visual effects indicators */}
              <div className="flex flex-col space-y-1 ml-2">
                {theme.effects.scanlines && (
                  <div className="text-xs px-1 py-0.5 bg-blue-600/30 text-blue-300 rounded">
                    Scan
                  </div>
                )}
                {theme.effects.glow && (
                  <div className="text-xs px-1 py-0.5 bg-purple-600/30 text-purple-300 rounded">
                    Glow
                  </div>
                )}
                {theme.effects.particles && (
                  <div className="text-xs px-1 py-0.5 bg-green-600/30 text-green-300 rounded">
                    FX
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Current theme info */}
      <div className="mt-4 p-3 bg-gray-900/60 rounded border border-gray-700">
        <div className="text-xs text-gray-400 mb-1">Current Theme</div>
        <div className="text-sm font-semibold text-white">
          {currentTheme.displayName}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {currentTheme.description}
        </div>
        
        {/* Effects status */}
        <div className="flex flex-wrap gap-1 mt-2">
          {Object.entries(currentTheme.effects).map(([effect, enabled]) => 
            enabled ? (
              <div key={effect} className="text-xs px-2 py-1 bg-green-600/20 text-green-300 rounded">
                {effect}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector 