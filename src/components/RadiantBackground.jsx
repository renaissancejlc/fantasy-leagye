import React from 'react'

export default function RadiantBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#f0abfc,_#fb7185,_#fde047)] opacity-90"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}