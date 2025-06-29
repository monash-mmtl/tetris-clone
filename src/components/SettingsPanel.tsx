import React, { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { storage } from '../utils/storage'
import { ThemeSelector } from './ThemeSelector'

interface SettingsState {
  // Audio settings
  soundEnabled: boolean
  musicEnabled: boolean
  
  // Visual settings
  showGhost: boolean
  showGrid: boolean
  
  // Game settings
  startLevel: number
  dropSpeed: 'slow' | 'normal' | 'fast'
  
  // Key bindings
  keyBindings: {
    moveLeft: string
    moveRight: string
    moveDown: string
    rotateCW: string
    rotateCCW: string
    hardDrop: string
    hold: string
    pause: string
  }
}

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const DEFAULT_SETTINGS: SettingsState = {
  soundEnabled: true,
  musicEnabled: true,
  showGhost: true,
  showGrid: false,
  startLevel: 1,
  dropSpeed: 'normal',
  keyBindings: {
    moveLeft: 'ArrowLeft',
    moveRight: 'ArrowRight',
    moveDown: 'ArrowDown',
    rotateCW: 'ArrowUp',
    rotateCCW: 'z',
    hardDrop: ' ',
    hold: 'c',
    pause: 'p',
  }
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { showGhost, toggleGhost } = useGameStore()
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  const [isRebinding, setIsRebinding] = useState<string | null>(null)

  // Load settings from storage on mount
  useEffect(() => {
    const savedSettings = storage.getSettings()
    setSettings({
      soundEnabled: !savedSettings.audioMuted,
      musicEnabled: !savedSettings.audioMuted,
      showGhost: savedSettings.ghostPiece,
      showGrid: savedSettings.showGrid,
      startLevel: 1, // Not currently stored in storage
      dropSpeed: savedSettings.dropSpeed,
      keyBindings: {
        moveLeft: savedSettings.keyBindings.moveLeft[0] || 'ArrowLeft',
        moveRight: savedSettings.keyBindings.moveRight[0] || 'ArrowRight',
        moveDown: savedSettings.keyBindings.moveDown[0] || 'ArrowDown',
        rotateCW: savedSettings.keyBindings.rotateCW[0] || 'ArrowUp',
        rotateCCW: savedSettings.keyBindings.rotateCCW[0] || 'z',
        hardDrop: savedSettings.keyBindings.hardDrop[0] || ' ',
        hold: savedSettings.keyBindings.hold[0] || 'c',
        pause: savedSettings.keyBindings.pause[0] || 'p',
      }
    })
  }, [isOpen])

  // Save settings to storage and apply changes
  const saveSettings = (newSettings: Partial<SettingsState>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    // Convert to storage format
    const storageSettings = {
      audioMuted: !updatedSettings.soundEnabled,
      ghostPiece: updatedSettings.showGhost,
      showGrid: updatedSettings.showGrid,
      dropSpeed: updatedSettings.dropSpeed,
      keyBindings: {
        moveLeft: [updatedSettings.keyBindings.moveLeft],
        moveRight: [updatedSettings.keyBindings.moveRight],
        moveDown: [updatedSettings.keyBindings.moveDown],
        rotateCW: [updatedSettings.keyBindings.rotateCW],
        rotateCCW: [updatedSettings.keyBindings.rotateCCW],
        hardDrop: [updatedSettings.keyBindings.hardDrop],
        hold: [updatedSettings.keyBindings.hold],
        pause: [updatedSettings.keyBindings.pause],
      }
    }

    storage.saveSettings(storageSettings)

    // Apply ghost piece setting to game store
    if (newSettings.showGhost !== undefined && newSettings.showGhost !== showGhost) {
      toggleGhost()
    }
  }

  const handleToggle = (key: keyof SettingsState) => {
    if (typeof settings[key] === 'boolean') {
      saveSettings({ [key]: !settings[key] })
    }
  }

  const handleLevelChange = (delta: number) => {
    const newLevel = Math.max(1, Math.min(15, settings.startLevel + delta))
    saveSettings({ startLevel: newLevel })
  }

  const handleDropSpeedChange = () => {
    const speeds: Array<'slow' | 'normal' | 'fast'> = ['slow', 'normal', 'fast']
    const currentIndex = speeds.indexOf(settings.dropSpeed)
    const nextIndex = (currentIndex + 1) % speeds.length
    saveSettings({ dropSpeed: speeds[nextIndex] })
  }

  const startKeyRebind = (action: string) => {
    setIsRebinding(action)
  }

  const handleKeyRebind = (event: KeyboardEvent) => {
    if (!isRebinding) return

    event.preventDefault()
    const key = event.key === ' ' ? 'Space' : event.key

    saveSettings({
      keyBindings: {
        ...settings.keyBindings,
        [isRebinding]: key
      }
    })

    setIsRebinding(null)
  }

  // Listen for key rebinding
  useEffect(() => {
    if (isRebinding) {
      window.addEventListener('keydown', handleKeyRebind)
      return () => window.removeEventListener('keydown', handleKeyRebind)
    }
  }, [isRebinding])

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
    saveSettings(DEFAULT_SETTINGS)
  }

  const formatKeyName = (key: string) => {
    if (key === ' ') return 'Space'
    if (key === 'ArrowLeft') return '←'
    if (key === 'ArrowRight') return '→'
    if (key === 'ArrowUp') return '↑'
    if (key === 'ArrowDown') return '↓'
    return key.toUpperCase()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-retro-bg border-4 border-retro-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-retro-border">⚙️ SETTINGS</h2>
          <button
            onClick={onClose}
            className="text-retro-text hover:text-red-400 text-3xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Audio Settings */}
          <div className="bg-gray-900 p-4 rounded border border-gray-700">
            <h3 className="text-retro-border font-bold text-lg mb-3">🔊 AUDIO</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-retro-text font-medium">Sound Effects</label>
                <button
                  onClick={() => handleToggle('soundEnabled')}
                  className={`
                    px-4 py-2 rounded font-bold transition-colors
                    ${settings.soundEnabled 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                    }
                  `}
                >
                  {settings.soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-retro-text font-medium">Background Music</label>
                <button
                  onClick={() => handleToggle('musicEnabled')}
                  className={`
                    px-4 py-2 rounded font-bold transition-colors
                    ${settings.musicEnabled 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                    }
                  `}
                >
                  {settings.musicEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="bg-gray-900 p-4 rounded border border-gray-700">
            <h3 className="text-retro-border font-bold text-lg mb-3">👁️ VISUAL</h3>
            
            {/* Theme Selector */}
            <div className="mb-4">
              <ThemeSelector />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-retro-text font-medium">👻 Ghost Piece</label>
                <button
                  onClick={() => handleToggle('showGhost')}
                  className={`
                    px-4 py-2 rounded font-bold transition-colors
                    ${settings.showGhost 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                    }
                  `}
                >
                  {settings.showGhost ? 'ON' : 'OFF'}
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-retro-text font-medium">Grid Lines</label>
                <button
                  onClick={() => handleToggle('showGrid')}
                  className={`
                    px-4 py-2 rounded font-bold transition-colors
                    ${settings.showGrid 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                    }
                  `}
                >
                  {settings.showGrid ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Game Settings */}
          <div className="bg-gray-900 p-4 rounded border border-gray-700">
            <h3 className="text-retro-border font-bold text-lg mb-3">🎮 GAMEPLAY</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-retro-text font-medium">Starting Level</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLevelChange(-1)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded font-bold"
                    disabled={settings.startLevel <= 1}
                  >
                    -
                  </button>
                  <span className="text-retro-text font-bold w-8 text-center text-lg">
                    {settings.startLevel}
                  </span>
                  <button
                    onClick={() => handleLevelChange(1)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded font-bold"
                    disabled={settings.startLevel >= 15}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-retro-text font-medium">Drop Speed</label>
                <button
                  onClick={handleDropSpeedChange}
                  className="px-4 py-2 bg-retro-border text-retro-bg font-bold rounded hover:bg-retro-border/90 transition-colors"
                >
                  {settings.dropSpeed.toUpperCase()}
                </button>
              </div>
            </div>
          </div>

          {/* Key Bindings */}
          <div className="bg-gray-900 p-4 rounded border border-gray-700">
            <h3 className="text-retro-border font-bold text-lg mb-3">⌨️ CONTROLS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(settings.keyBindings).map(([action, key]) => (
                <div key={action} className="flex justify-between items-center">
                  <label className="text-retro-text font-medium capitalize">
                    {action.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <button
                    onClick={() => startKeyRebind(action)}
                    className={`
                      px-3 py-1 rounded font-mono text-sm transition-colors
                      ${isRebinding === action
                        ? 'bg-yellow-600 text-black animate-pulse'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }
                    `}
                  >
                    {isRebinding === action ? 'Press Key...' : formatKeyName(key)}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={resetToDefaults}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded transition-colors"
            >
              RESET TO DEFAULTS
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-retro-border text-retro-bg font-bold rounded hover:bg-retro-border/90 transition-colors flex-1"
            >
              CLOSE
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-retro-text/60 text-center">
          <p>Settings are automatically saved and will persist between sessions</p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel 