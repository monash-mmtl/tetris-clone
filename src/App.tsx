import React, { useEffect } from 'react'
import Game from './components/Game'
import { useTheme } from './hooks/useTheme'
import './index.css'

function App() {
  const { isLoading } = useTheme()

  // Show loading screen while theme is being applied
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return <Game />
}

export default App 