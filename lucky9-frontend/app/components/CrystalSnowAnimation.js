'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const CrystalSnowAnimation = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.offsetWidth
    const height = container.offsetHeight

    // Create crystal snowflakes
    const snowflakes = Array.from({ length: 50 }, (_, i) => {
      const snowflake = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      snowflake.setAttribute("viewBox", "0 0 32 32")
      snowflake.setAttribute("width", `${Math.random() * 20 + 15}px`)
      snowflake.setAttribute("height", `${Math.random() * 20 + 10}px`)
      snowflake.style.position = "absolute"
      snowflake.style.left = `${Math.random() * width}px`
      snowflake.style.top = `${Math.random() * height}px`
      snowflake.style.opacity = `${Math.random() * 0.5 + 0.5}`
      snowflake.innerHTML = `
        <path d="M16 0 L16 32 M0 16 L32 16 M4.6 4.6 L27.4 27.4 M27.4 4.6 L4.6 27.4" 
              stroke="white" stroke-width="1" fill="none" />
        <circle cx="16" cy="16" r="2" fill="white" />
      `
      container.appendChild(snowflake)
      return snowflake
    })

    // Animate crystal snowflakes
    snowflakes.forEach((snowflake) => {
      gsap.to(snowflake, {
        y: height,
        x: `+=${Math.random() * 100 - 50}`,
        rotation: Math.random() * 360,
        duration: Math.random() * 15 + 10,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 5,
      })

      // Add a subtle pulsing effect
      gsap.to(snowflake, {
        scale: 1.2,
        opacity: 0.8,
        duration: Math.random() * 2 + 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    // Clean up
    return () => {
      snowflakes.forEach((snowflake) => snowflake.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-30"
    />
  )
}

export default CrystalSnowAnimation

