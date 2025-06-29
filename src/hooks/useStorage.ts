import { useState, useEffect, useCallback } from 'react'
import { storage, HighScore, GameSettings, GameStatistics } from '../utils/storage'

/**
 * Hook for managing high scores
 */
export function useHighScores() {
  const [highScores, setHighScores] = useState<HighScore[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load high scores on mount
  useEffect(() => {
    const scores = storage.getHighScores()
    setHighScores(scores)
    setIsLoading(false)
  }, [])

  const addHighScore = useCallback((score: Omit<HighScore, 'id'>) => {
    const success = storage.saveHighScore(score)
    if (success) {
      const updatedScores = storage.getHighScores()
      setHighScores(updatedScores)
    }
    return success
  }, [])

  const clearHighScores = useCallback(() => {
    const success = storage.clearHighScores()
    if (success) {
      setHighScores([])
    }
    return success
  }, [])

  const isHighScore = useCallback((score: number) => {
    if (highScores.length < 10) return true
    return score > highScores[highScores.length - 1].score
  }, [highScores])

  return {
    highScores,
    isLoading,
    addHighScore,
    clearHighScores,
    isHighScore,
  }
}

/**
 * Hook for managing game settings
 */
export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(() => storage.getSettings())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedSettings = storage.getSettings()
    setSettings(savedSettings)
    setIsLoading(false)
  }, [])

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    const success = storage.saveSettings(newSettings)
    if (success) {
      const updatedSettings = storage.getSettings()
      setSettings(updatedSettings)
    }
    return success
  }, [])

  const resetSettings = useCallback(() => {
    const success = storage.resetSettings()
    if (success) {
      const defaultSettings = storage.getSettings()
      setSettings(defaultSettings)
    }
    return success
  }, [])

  const toggleSetting = useCallback((key: keyof GameSettings) => {
    if (typeof settings[key] === 'boolean') {
      return updateSettings({ [key]: !settings[key] } as Partial<GameSettings>)
    }
    return false
  }, [settings, updateSettings])

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
    toggleSetting,
  }
}

/**
 * Hook for managing game statistics
 */
export function useGameStatistics() {
  const [statistics, setStatistics] = useState<GameStatistics>(() => storage.getStatistics())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stats = storage.getStatistics()
    setStatistics(stats)
    setIsLoading(false)
  }, [])

  const updateStatistics = useCallback((update: Partial<GameStatistics>) => {
    const success = storage.updateStatistics(update)
    if (success) {
      const updatedStats = storage.getStatistics()
      setStatistics(updatedStats)
    }
    return success
  }, [])

  const resetStatistics = useCallback(() => {
    const success = storage.resetStatistics()
    if (success) {
      const defaultStats = storage.getStatistics()
      setStatistics(defaultStats)
    }
    return success
  }, [])

  const recordGameCompletion = useCallback((gameData: {
    score: number
    level: number
    lines: number
    duration: number
    pieces: Record<string, number>
    lineClears: Record<string, number>
  }) => {
    const success = storage.recordGameCompletion(gameData)
    if (success) {
      const updatedStats = storage.getStatistics()
      setStatistics(updatedStats)
    }
    return success
  }, [])

  return {
    statistics,
    isLoading,
    updateStatistics,
    resetStatistics,
    recordGameCompletion,
  }
}

/**
 * Hook for data export/import
 */
export function useDataManagement() {
  const exportData = useCallback(() => {
    return storage.exportData()
  }, [])

  const importData = useCallback((jsonData: string) => {
    return storage.importData(jsonData)
  }, [])

  const clearAllData = useCallback(() => {
    return storage.clearAllData()
  }, [])

  const downloadBackup = useCallback(() => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `tetris-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }, [exportData])

  const uploadBackup = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const success = importData(content)
          resolve(success)
        } catch {
          resolve(false)
        }
      }
      reader.onerror = () => resolve(false)
      reader.readAsText(file)
    })
  }, [importData])

  return {
    exportData,
    importData,
    clearAllData,
    downloadBackup,
    uploadBackup,
  }
}

/**
 * Comprehensive hook combining all storage functionality
 */
export function useGameData() {
  const highScores = useHighScores()
  const settings = useGameSettings()
  const statistics = useGameStatistics()
  const dataManagement = useDataManagement()

  const isLoading = highScores.isLoading || settings.isLoading || statistics.isLoading

  return {
    highScores,
    settings,
    statistics,
    dataManagement,
    isLoading,
  }
} 