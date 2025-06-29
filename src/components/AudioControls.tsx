import React from 'react'
import { useGameAudio } from '../hooks/useAudio'

interface AudioControlsProps {
  className?: string
  size?: 'small' | 'medium' | 'large'
}

export function AudioControls({ className = '', size = 'medium' }: AudioControlsProps) {
  const { isMuted, toggleMute, isAudioSupported } = useGameAudio()

  if (!isAudioSupported) {
    return (
      <div className={`flex items-center text-gray-500 ${className}`}>
        <span className="text-xs">Audio not supported</span>
      </div>
    )
  }

  const sizeClasses = {
    small: 'text-xs p-1',
    medium: 'text-sm p-2', 
    large: 'text-base p-3'
  }

  const iconSize = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleMute}
        className={`
          ${sizeClasses[size]}
          bg-gray-800 hover:bg-gray-700 
          border border-gray-600 hover:border-gray-500
          rounded transition-all duration-200
          flex items-center gap-2
          ${isMuted ? 'text-red-400' : 'text-green-400'}
        `}
        title={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        <span className={iconSize[size]}>
          {isMuted ? '🔇' : '🔊'}
        </span>
        <span className="hidden sm:inline">
          {isMuted ? 'Muted' : 'Sound'}
        </span>
      </button>
      
      {/* Audio indicator */}
      <div className={`
        w-2 h-2 rounded-full transition-colors duration-200
        ${isMuted ? 'bg-red-400' : 'bg-green-400'}
      `} />
    </div>
  )
}

export default AudioControls 