import { useEffect, useRef } from 'react'

/**
 * Custom hook that runs a callback at ~60 FPS using requestAnimationFrame
 */
export function useGameLoop(callback: () => void, isActive: boolean = true) {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const targetFPS = 60
  const targetFrameTime = 1000 / targetFPS // ~16.67ms
  
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      
      // Only call callback if enough time has passed for target FPS
      if (deltaTime >= targetFrameTime) {
        callback()
        previousTimeRef.current = time
      }
    } else {
      previousTimeRef.current = time
    }
    
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate)
    }
  }
  
  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate)
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isActive])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])
} 