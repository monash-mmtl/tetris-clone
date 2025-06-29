// Web Audio API based sound generation for 8-bit style effects
export class AudioEngine {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isMuted: boolean = false

  constructor() {
    this.initializeAudioContext()
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime) // Default volume
    } catch (error) {
      console.warn('Audio not supported:', error)
    }
  }

  private ensureAudioContext() {
    if (!this.audioContext) return false
    
    // Resume audio context if it's suspended (required for user interaction)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    return true
  }

  setMuted(muted: boolean) {
    this.isMuted = muted
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        muted ? 0 : 0.3, 
        this.audioContext!.currentTime
      )
    }
  }

  getMuted(): boolean {
    return this.isMuted
  }

  // Generate basic waveform
  private createOscillator(frequency: number, type: OscillatorType = 'square'): OscillatorNode | null {
    if (!this.ensureAudioContext() || !this.audioContext) return null

    const oscillator = this.audioContext.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    
    return oscillator
  }

  // Play a simple tone
  playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.1) {
    if (!this.ensureAudioContext() || !this.audioContext || this.isMuted) return

    const oscillator = this.createOscillator(frequency, type)
    if (!oscillator) return

    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain!)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // Play chord (multiple frequencies)
  playChord(frequencies: number[], duration: number, type: OscillatorType = 'square') {
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, duration, type, 0.05), index * 10)
    })
  }

  // 8-bit style sound effects
  playMovementSound() {
    this.playTone(220, 0.1, 'square', 0.05) // A3
  }

  playRotationSound() {
    this.playTone(330, 0.15, 'square', 0.08) // E4
  }

  playLineClearSound(lines: number) {
    const frequencies = [262, 330, 392, 523] // C4, E4, G4, C5
    this.playChord(frequencies.slice(0, lines), 0.3, 'square')
  }

  playLockSound() {
    this.playTone(147, 0.2, 'square', 0.06) // D3
  }

  playLevelUpSound() {
    const melody = [523, 659, 784, 1047] // C5, E5, G5, C6
    melody.forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.2, 'square', 0.1), index * 150)
    })
  }

  playGameOverSound() {
    const descending = [523, 466, 415, 370, 330, 294, 262] // C5 down to C4
    descending.forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.3, 'triangle', 0.08), index * 200)
    })
  }

  playDropSound() {
    // Quick descending sound for hard drop
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.playTone(400 - i * 20, 0.05, 'square', 0.03), i * 20)
    }
  }

  // Tetris-style background music patterns
  private musicTimeoutId: number | null = null
  
  playMenuMusic() {
    if (this.isMuted) return
    
    // Stop any existing music
    this.stopMenuMusic()
    
    // Simple C major arpeggio pattern
    const pattern = [262, 330, 392, 523, 392, 330] // C4, E4, G4, C5, G4, E4
    pattern.forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.02), index * 500) // Reduced volume
    })
    
    // Repeat every 4 seconds (slightly longer gap)
    this.musicTimeoutId = window.setTimeout(() => this.playMenuMusic(), 4000)
  }
  
  stopMenuMusic() {
    if (this.musicTimeoutId) {
      clearTimeout(this.musicTimeoutId)
      this.musicTimeoutId = null
    }
  }

  stopAllSounds() {
    // This is a simplified stop - in a real app you'd track active oscillators
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.suspend()
      setTimeout(() => {
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume()
        }
      }, 100)
    }
  }
}

// Singleton instance
export const audioEngine = new AudioEngine()

// Sound event types
export type SoundEvent = 
  | 'move'
  | 'rotate' 
  | 'lock'
  | 'lineClear'
  | 'levelUp'
  | 'gameOver'
  | 'drop'
  | 'menuMusic'
  | 'stopMusic'

// Sound effect mappings
export const playSound = (event: SoundEvent, data?: any) => {
  switch (event) {
    case 'move':
      audioEngine.playMovementSound()
      break
    case 'rotate':
      audioEngine.playRotationSound()
      break
    case 'lock':
      audioEngine.playLockSound()
      break
    case 'lineClear':
      audioEngine.playLineClearSound(data?.lines || 1)
      break
    case 'levelUp':
      audioEngine.playLevelUpSound()
      break
    case 'gameOver':
      audioEngine.playGameOverSound()
      break
    case 'drop':
      audioEngine.playDropSound()
      break
    case 'menuMusic':
      audioEngine.playMenuMusic()
      break
    case 'stopMusic':
      audioEngine.stopMenuMusic()
      break
  }
} 