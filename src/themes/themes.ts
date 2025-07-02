export interface Theme {
  id: string
  name: string
  displayName: string
  description: string
  colors: {
    // Background colors
    primary: string
    secondary: string
    accent: string
    
    // Game board colors
    boardBg: string
    boardBorder: string
    gridLines: string
    
    // UI colors
    text: string
    textSecondary: string
    textAccent: string
    
    // Piece colors
    pieces: {
      I: string
      O: string
      T: string
      S: string
      Z: string
      J: string
      L: string
      ghost: string
    }
    
    // State colors
    success: string
    warning: string
    error: string
    info: string
  }
  effects: {
    scanlines: boolean
    glow: boolean
    particles: boolean
    crtCurve: boolean
  }
}

export const themes: Record<string, Theme> = {
  // Classic Green Monochrome (Original Game Boy style)
  classic: {
    id: 'classic',
    name: 'classic',
    displayName: '🟢 Classic',
    description: 'Original Game Boy green monochrome',
    colors: {
      primary: '#0f380f',
      secondary: '#306230',
      accent: '#8bac0f',
      boardBg: '#0f380f',
      boardBorder: '#8bac0f',
      gridLines: '#306230',
      text: '#9bbc0f',
      textSecondary: '#8bac0f',
      textAccent: '#306230',
      pieces: {
        I: '#9bbc0f',
        O: '#8bac0f', 
        T: '#8bac0f',
        S: '#8bac0f',
        Z: '#8bac0f',
        J: '#8bac0f',
        L: '#8bac0f',
        ghost: '#306230'
      },
      success: '#8bac0f',
      warning: '#8bac0f',
      error: '#306230',
      info: '#9bbc0f'
    },
    effects: {
      scanlines: true,
      glow: true,
      particles: false,
      crtCurve: true
    }
  },

  // Neon Cyberpunk
  neon: {
    id: 'neon',
    name: 'neon',
    displayName: '🌆 Neon',
    description: 'Cyberpunk neon aesthetic',
    colors: {
      primary: '#0a0a0a',
      secondary: '#1a1a2e',
      accent: '#00ffff',
      boardBg: '#0a0a0a',
      boardBorder: '#00ffff',
      gridLines: '#16213e',
      text: '#00ffff',
      textSecondary: '#ff00ff',
      textAccent: '#ffff00',
      pieces: {
        I: '#00ffff',
        O: '#ffff00',
        T: '#ff00ff',
        S: '#00ff00',
        Z: '#ff0080',
        J: '#0080ff',
        L: '#ff8000',
        ghost: '#404080'
      },
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0080',
      info: '#00ffff'
    },
    effects: {
      scanlines: true,
      glow: true,
      particles: true,
      crtCurve: false
    }
  },

  // Retro Arcade
  arcade: {
    id: 'arcade',
    name: 'arcade',
    displayName: '🕹️ Arcade',
    description: 'Classic 80s arcade cabinet',
    colors: {
      primary: '#000000',
      secondary: '#1a1a1a',
      accent: '#ffaa00',
      boardBg: '#000000',
      boardBorder: '#ffaa00',
      gridLines: '#333333',
      text: '#ffaa00',
      textSecondary: '#ffdd00',
      textAccent: '#ff6600',
      pieces: {
        I: '#ff0000',
        O: '#ffff00',
        T: '#aa00ff',
        S: '#00ff00',
        Z: '#ff6600',
        J: '#0066ff',
        L: '#ffaa00',
        ghost: '#666666'
      },
      success: '#00ff00',
      warning: '#ffaa00',
      error: '#ff0000',
      info: '#0066ff'
    },
    effects: {
      scanlines: true,
      glow: false,
      particles: false,
      crtCurve: true
    }
  },

  // Pastel Dream
  pastel: {
    id: 'pastel',
    name: 'pastel',
    displayName: '🌸 Pastel',
    description: 'Soft pastel colors',
    colors: {
      primary: '#fef7f0',
      secondary: '#f4e4bc',
      accent: '#a8dadc',
      boardBg: '#fef7f0',
      boardBorder: '#a8dadc',
      gridLines: '#f4e4bc',
      text: '#457b9d',
      textSecondary: '#1d3557',
      textAccent: '#e63946',
      pieces: {
        I: '#a8dadc',
        O: '#f1faee',
        T: '#e63946',
        S: '#2a9d8f',
        Z: '#e9c46a',
        J: '#457b9d',
        L: '#f4a261',
        ghost: '#f4e4bc'
      },
      success: '#2a9d8f',
      warning: '#e9c46a',
      error: '#e63946',
      info: '#457b9d'
    },
    effects: {
      scanlines: false,
      glow: false,
      particles: true,
      crtCurve: false
    }
  },

  // Dark Mode (Modern)
  dark: {
    id: 'dark',
    name: 'dark',
    displayName: '🌙 Dark',
    description: 'Modern dark theme',
    colors: {
      primary: '#1a1a1a',
      secondary: '#2d2d2d',
      accent: '#bb86fc',
      boardBg: '#121212',
      boardBorder: '#bb86fc',
      gridLines: '#333333',
      text: '#ffffff',
      textSecondary: '#aaaaaa',
      textAccent: '#bb86fc',
      pieces: {
        I: '#03dac6',
        O: '#ffd700',
        T: '#bb86fc',
        S: '#4caf50',
        Z: '#f44336',
        J: '#2196f3',
        L: '#ff9800',
        ghost: '#666666'
      },
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3'
    },
    effects: {
      scanlines: false,
      glow: true,
      particles: false,
      crtCurve: false
    }
  },

  // Synthwave
  synthwave: {
    id: 'synthwave',
    name: 'synthwave',
    displayName: '🌊 Synthwave',
    description: 'Retro synthwave aesthetic',
    colors: {
      primary: '#0d1b2a',
      secondary: '#1b263b',
      accent: '#ff006e',
      boardBg: '#0d1b2a',
      boardBorder: '#ff006e',
      gridLines: '#1b263b',
      text: '#fcf6f5',
      textSecondary: '#ffc2e2',
      textAccent: '#ff006e',
      pieces: {
        I: '#72efdd',
        O: '#ffd23f',
        T: '#ff006e',
        S: '#06ffa5',
        Z: '#ff4081',
        J: '#8338ec',
        L: '#fb8500',
        ghost: '#415a77'
      },
      success: '#06ffa5',
      warning: '#ffd23f',
      error: '#ff006e',
      info: '#72efdd'
    },
    effects: {
      scanlines: true,
      glow: true,
      particles: true,
      crtCurve: false
    }
  },

  // Blue Classic
  blueClassic: {
    id: 'blueClassic',
    name: 'blueClassic',
    displayName: '🔵 Blue Classic',
    description: 'Classic retro style with blue background',
    colors: {
      primary: '#0f1c38',
      secondary: '#2d4a62',
      accent: '#0f8bac',
      boardBg: '#0f1c38',
      boardBorder: '#0f8bac',
      gridLines: '#2d4a62',
      text: '#0f9bbc',
      textSecondary: '#0f8bac',
      textAccent: '#2d4a62',
      pieces: {
        I: '#0f9bbc',
        O: '#0f8bac', 
        T: '#0f8bac',
        S: '#0f8bac',
        Z: '#0f8bac',
        J: '#0f8bac',
        L: '#0f8bac',
        ghost: '#2d4a62'
      },
      success: '#0f8bac',
      warning: '#0f8bac',
      error: '#2d4a62',
      info: '#0f9bbc'
    },
    effects: {
      scanlines: true,
      glow: true,
      particles: false,
      crtCurve: true
    }
  }
}

export const defaultTheme = themes.blueClassic

export function getTheme(themeId: string): Theme {
  return themes[themeId] || defaultTheme
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  
  // Apply CSS custom properties
  root.style.setProperty('--theme-primary', theme.colors.primary)
  root.style.setProperty('--theme-secondary', theme.colors.secondary)
  root.style.setProperty('--theme-accent', theme.colors.accent)
  root.style.setProperty('--theme-board-bg', theme.colors.boardBg)
  root.style.setProperty('--theme-board-border', theme.colors.boardBorder)
  root.style.setProperty('--theme-grid-lines', theme.colors.gridLines)
  root.style.setProperty('--theme-text', theme.colors.text)
  root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary)
  root.style.setProperty('--theme-text-accent', theme.colors.textAccent)
  
  // Piece colors
  root.style.setProperty('--theme-piece-I', theme.colors.pieces.I)
  root.style.setProperty('--theme-piece-O', theme.colors.pieces.O)
  root.style.setProperty('--theme-piece-T', theme.colors.pieces.T)
  root.style.setProperty('--theme-piece-S', theme.colors.pieces.S)
  root.style.setProperty('--theme-piece-Z', theme.colors.pieces.Z)
  root.style.setProperty('--theme-piece-J', theme.colors.pieces.J)
  root.style.setProperty('--theme-piece-L', theme.colors.pieces.L)
  root.style.setProperty('--theme-piece-ghost', theme.colors.pieces.ghost)
  
  // State colors
  root.style.setProperty('--theme-success', theme.colors.success)
  root.style.setProperty('--theme-warning', theme.colors.warning)
  root.style.setProperty('--theme-error', theme.colors.error)
  root.style.setProperty('--theme-info', theme.colors.info)
}

export function getThemeList(): Theme[] {
  return Object.values(themes)
} 