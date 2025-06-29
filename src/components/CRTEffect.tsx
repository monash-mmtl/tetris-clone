import React from 'react'

interface CRTEffectProps {
  enabled?: boolean
  intensity?: number
  className?: string
  children: React.ReactNode
}

export function CRTEffect({ 
  enabled = true, 
  intensity = 0.15, 
  className = '', 
  children 
}: CRTEffectProps) {
  if (!enabled) {
    return <>{children}</>
  }

  const scanlineStyle = {
    '--scanline-intensity': intensity.toString(),
  } as React.CSSProperties

  return (
    <div 
      className={`crt-container ${className}`}
      style={scanlineStyle}
    >
      {children}
      
      {/* Scan-line overlay */}
      <div className="crt-scanlines pointer-events-none absolute inset-0 z-10" />
      
      {/* Subtle screen curve effect */}
      <div className="crt-curve pointer-events-none absolute inset-0 z-10" />
      
      {/* Phosphor glow effect */}
      <div className="crt-glow pointer-events-none absolute inset-0 z-5" />
    </div>
  )
}

export default CRTEffect 