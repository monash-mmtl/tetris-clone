/**
 * Storage utilities for persisting game data using localStorage
 */

// Storage keys
const STORAGE_KEYS = {
  HIGH_SCORES: 'tetris-high-scores',
  SETTINGS: 'tetris-settings',
  STATISTICS: 'tetris-statistics',
  AUDIO_MUTED: 'tetris-audio-muted',
} as const

// Types for stored data
export interface HighScore {
  id: string
  score: number
  level: number
  lines: number
  date: string
  duration: number // in seconds
}

export interface GameSettings {
  audioMuted: boolean
  ghostPiece: boolean
  showGrid: boolean
  dropSpeed: 'slow' | 'normal' | 'fast'
  theme: 'classic' | 'neon' | 'arcade' | 'pastel' | 'dark' | 'synthwave' | 'retro' | 'blueClassic'
  keyBindings: {
    moveLeft: string[]
    moveRight: string[]
    moveDown: string[]
    rotateCW: string[]
    rotateCCW: string[]
    hardDrop: string[]
    hold: string[]
    pause: string[]
  }
}

export interface GameStatistics {
  totalGamesPlayed: number
  totalScore: number
  totalLines: number
  totalTimePlayed: number // in seconds
  bestScore: number
  bestLevel: number
  averageScore: number
  pieceStatistics: {
    I: number
    O: number
    T: number
    S: number
    Z: number
    J: number
    L: number
  }
  lineClears: {
    single: number
    double: number
    triple: number
    tetris: number
  }
}

// Default values
const DEFAULT_SETTINGS: GameSettings = {
  audioMuted: false,
  ghostPiece: true,
  showGrid: false,
  dropSpeed: 'normal',
  theme: 'blueClassic',
  keyBindings: {
    moveLeft: ['ArrowLeft'],
    moveRight: ['ArrowRight'],
    moveDown: ['ArrowDown'],
    rotateCW: ['ArrowUp', 'x', 'X'],
    rotateCCW: ['z', 'Z'],
    hardDrop: [' ', 'Control'],
    hold: ['Shift'],
    pause: ['p', 'P'],
  }
}

const DEFAULT_STATISTICS: GameStatistics = {
  totalGamesPlayed: 0,
  totalScore: 0,
  totalLines: 0,
  totalTimePlayed: 0,
  bestScore: 0,
  bestLevel: 1,
  averageScore: 0,
  pieceStatistics: {
    I: 0,
    O: 0,
    T: 0,
    S: 0,
    Z: 0,
    J: 0,
    L: 0,
  },
  lineClears: {
    single: 0,
    double: 0,
    triple: 0,
    tetris: 0,
  }
}

/**
 * Safe localStorage operations with error handling
 */
class StorageManager {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  private safeGet<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) return defaultValue

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Failed to parse localStorage item ${key}:`, error)
      return defaultValue
    }
  }

  private safeSet<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Failed to save to localStorage ${key}:`, error)
      return false
    }
  }

  // High Scores
  getHighScores(): HighScore[] {
    return this.safeGet(STORAGE_KEYS.HIGH_SCORES, [])
  }

  saveHighScore(score: Omit<HighScore, 'id'>): boolean {
    const scores = this.getHighScores()
    const newScore: HighScore = {
      ...score,
      id: Date.now().toString(),
    }
    
    // Add new score and sort by score (descending)
    scores.push(newScore)
    scores.sort((a, b) => b.score - a.score)
    
    // Keep only top 10 scores
    const topScores = scores.slice(0, 10)
    
    return this.safeSet(STORAGE_KEYS.HIGH_SCORES, topScores)
  }

  clearHighScores(): boolean {
    return this.safeSet(STORAGE_KEYS.HIGH_SCORES, [])
  }

  // Settings
  getSettings(): GameSettings {
    return this.safeGet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  }

  saveSettings(settings: Partial<GameSettings>): boolean {
    const currentSettings = this.getSettings()
    const updatedSettings = { ...currentSettings, ...settings }
    return this.safeSet(STORAGE_KEYS.SETTINGS, updatedSettings)
  }

  resetSettings(): boolean {
    return this.safeSet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  }

  // Statistics
  getStatistics(): GameStatistics {
    return this.safeGet(STORAGE_KEYS.STATISTICS, DEFAULT_STATISTICS)
  }

  updateStatistics(update: Partial<GameStatistics>): boolean {
    const currentStats = this.getStatistics()
    const updatedStats = { ...currentStats, ...update }
    
    // Recalculate derived values
    if (updatedStats.totalGamesPlayed > 0) {
      updatedStats.averageScore = Math.round(updatedStats.totalScore / updatedStats.totalGamesPlayed)
    }
    
    return this.safeSet(STORAGE_KEYS.STATISTICS, updatedStats)
  }

  resetStatistics(): boolean {
    return this.safeSet(STORAGE_KEYS.STATISTICS, DEFAULT_STATISTICS)
  }

  // Game completion tracking
  recordGameCompletion(gameData: {
    score: number
    level: number
    lines: number
    duration: number
    pieces: Record<string, number>
    lineClears: Record<string, number>
  }): boolean {
    // Update statistics
    const stats = this.getStatistics()
    const updatedStats: GameStatistics = {
      ...stats,
      totalGamesPlayed: stats.totalGamesPlayed + 1,
      totalScore: stats.totalScore + gameData.score,
      totalLines: stats.totalLines + gameData.lines,
      totalTimePlayed: stats.totalTimePlayed + gameData.duration,
      bestScore: Math.max(stats.bestScore, gameData.score),
      bestLevel: Math.max(stats.bestLevel, gameData.level),
      pieceStatistics: {
        I: stats.pieceStatistics.I + (gameData.pieces.I || 0),
        O: stats.pieceStatistics.O + (gameData.pieces.O || 0),
        T: stats.pieceStatistics.T + (gameData.pieces.T || 0),
        S: stats.pieceStatistics.S + (gameData.pieces.S || 0),
        Z: stats.pieceStatistics.Z + (gameData.pieces.Z || 0),
        J: stats.pieceStatistics.J + (gameData.pieces.J || 0),
        L: stats.pieceStatistics.L + (gameData.pieces.L || 0),
      },
      lineClears: {
        single: stats.lineClears.single + (gameData.lineClears.single || 0),
        double: stats.lineClears.double + (gameData.lineClears.double || 0),
        triple: stats.lineClears.triple + (gameData.lineClears.triple || 0),
        tetris: stats.lineClears.tetris + (gameData.lineClears.tetris || 0),
      },
      averageScore: 0, // Will be calculated in updateStatistics
    }

    const statsSuccess = this.updateStatistics(updatedStats)

    // Save high score if it qualifies
    const highScoreSuccess = this.saveHighScore({
      score: gameData.score,
      level: gameData.level,
      lines: gameData.lines,
      date: new Date().toISOString(),
      duration: gameData.duration,
    })

    return statsSuccess && highScoreSuccess
  }

  // Export/Import functionality
  exportData(): string {
    const data = {
      highScores: this.getHighScores(),
      settings: this.getSettings(),
      statistics: this.getStatistics(),
      exportDate: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      
      let success = true
      if (data.highScores) {
        success &&= this.safeSet(STORAGE_KEYS.HIGH_SCORES, data.highScores)
      }
      if (data.settings) {
        success &&= this.safeSet(STORAGE_KEYS.SETTINGS, data.settings)
      }
      if (data.statistics) {
        success &&= this.safeSet(STORAGE_KEYS.STATISTICS, data.statistics)
      }
      
      return success
    } catch (error) {
      console.error('Failed to import data:', error)
      return false
    }
  }

  // Clear all data
  clearAllData(): boolean {
    return (
      this.clearHighScores() &&
      this.resetSettings() &&
      this.resetStatistics()
    )
  }
}

// Singleton instance
export const storage = new StorageManager() 