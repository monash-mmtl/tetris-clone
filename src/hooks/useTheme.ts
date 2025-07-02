import { useState, useEffect, useCallback } from 'react'
import { Theme, themes, defaultTheme, applyTheme, getTheme } from '../themes/themes'
import { storage } from '../utils/storage'

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme)
  const [isLoading, setIsLoading] = useState(true)

  // Load theme from storage on mount
  useEffect(() => {
    const savedTheme = storage.getSettings().theme || 'blueClassic'
    const theme = getTheme(savedTheme)
    setCurrentTheme(theme)
    applyTheme(theme)
    setIsLoading(false)
  }, [])

  // Change theme function
  const changeTheme = useCallback((themeId: string) => {
    const theme = getTheme(themeId)
    setCurrentTheme(theme)
    applyTheme(theme)
    
    // Save to storage
    const currentSettings = storage.getSettings()
    storage.saveSettings({
      ...currentSettings,
      theme: themeId
    })
  }, [])

  // Get all available themes
  const availableThemes = Object.values(themes)

  // Theme utilities
  const getNextTheme = useCallback(() => {
    const themeIds = Object.keys(themes)
    const currentIndex = themeIds.indexOf(currentTheme.id)
    const nextIndex = (currentIndex + 1) % themeIds.length
    return themeIds[nextIndex]
  }, [currentTheme.id])

  const getPreviousTheme = useCallback(() => {
    const themeIds = Object.keys(themes)
    const currentIndex = themeIds.indexOf(currentTheme.id)
    const prevIndex = currentIndex === 0 ? themeIds.length - 1 : currentIndex - 1
    return themeIds[prevIndex]
  }, [currentTheme.id])

  return {
    currentTheme,
    availableThemes,
    isLoading,
    changeTheme,
    getNextTheme,
    getPreviousTheme,
    // Convenience functions
    nextTheme: () => changeTheme(getNextTheme()),
    previousTheme: () => changeTheme(getPreviousTheme())
  }
}

export default useTheme 