import { useState, useEffect, useCallback } from 'react'
import { audioEngine, playSound, SoundEvent } from '../audio/sounds'

interface UseAudioReturn {
  isMuted: boolean
  toggleMute: () => void
  setMuted: (muted: boolean) => void
  play: (event: SoundEvent, data?: any) => void
  isAudioSupported: boolean
}

/**
 * Custom hook for managing audio state and playback
 */
export function useAudio(): UseAudioReturn {
  const [isMuted, setIsMutedState] = useState(() => {
    // Load mute state from localStorage
    const saved = localStorage.getItem('tetris-audio-muted')
    return saved ? JSON.parse(saved) : false
  })

  const [isAudioSupported, setIsAudioSupported] = useState(true)

  // Initialize audio state
  useEffect(() => {
    try {
      audioEngine.setMuted(isMuted)
      setIsAudioSupported(true)
    } catch (error) {
      console.warn('Audio initialization failed:', error)
      setIsAudioSupported(false)
    }
  }, [isMuted])

  // Save mute state to localStorage
  useEffect(() => {
    localStorage.setItem('tetris-audio-muted', JSON.stringify(isMuted))
  }, [isMuted])

  const setMuted = useCallback((muted: boolean) => {
    setIsMutedState(muted)
    audioEngine.setMuted(muted)
  }, [])

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted
    setMuted(newMuted)
  }, [isMuted, setMuted])

  const play = useCallback((event: SoundEvent, data?: any) => {
    if (!isAudioSupported || isMuted) return
    
    try {
      playSound(event, data)
    } catch (error) {
      console.warn('Sound playback failed:', error)
    }
  }, [isAudioSupported, isMuted])

  return {
    isMuted,
    toggleMute,
    setMuted,
    play,
    isAudioSupported
  }
}

/**
 * Hook for playing sounds with game events
 */
export function useGameAudio() {
  const { play, isMuted, toggleMute, isAudioSupported } = useAudio()

  const sounds = {
    move: () => play('move'),
    rotate: () => play('rotate'),
    lock: () => play('lock'),
    drop: () => play('drop'),
    lineClear: (lines: number) => play('lineClear', { lines }),
    levelUp: () => play('levelUp'),
    gameOver: () => play('gameOver'),
    startMenuMusic: () => play('menuMusic'),
    stopMenuMusic: () => play('stopMusic'),
  }

  return {
    sounds,
    isMuted,
    toggleMute,
    isAudioSupported
  }
} 