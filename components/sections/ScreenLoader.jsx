'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/ScreenLoader.module.css'

export default function ScreenLoader({ onDismiss }) {
  const overlayRef = useRef(null)

  const handleStart = useCallback(() => {
    window.dispatchEvent(new CustomEvent('loader-dismissed'))

    const overlay = overlayRef.current
    if (!overlay) {
      onDismiss?.()
      return
    }

    overlay.style.pointerEvents = 'none'

    const top = document.createElement('div')
    top.className = styles.splitTop

    const bottom = document.createElement('div')
    bottom.className = styles.splitBottom

    const line = document.createElement('div')
    line.className = styles.centerLine

    document.body.appendChild(top)
    document.body.appendChild(bottom)
    document.body.appendChild(line)

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out',
    })

    gsap.fromTo(
      line,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.25, ease: 'power2.out' }
    )

    gsap.to(top, {
      y: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
      force3D: true,
    })

    gsap.to(bottom, {
      y: '100%',
      duration: 0.8,
      ease: 'power3.inOut',
      force3D: true,
    })

    gsap.to(line, {
      opacity: 0,
      duration: 0.25,
      delay: 0.2,
    })

    setTimeout(() => {
      top.remove()
      bottom.remove()
      line.remove()
      window.dispatchEvent(new CustomEvent('loader-animation-done'))
      onDismiss?.()
    }, 800)
  }, [onDismiss])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDismiss?.()
      return
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault()
        handleStart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleStart, onDismiss])

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Intro"
    >
      <div className={styles.liquidBg} aria-hidden="true" />

      <p className={styles.monogram}>
        {profile.name.full} • 2026 CSE Graduate
      </p>

      <button
        className={styles.startBtn}
        onClick={handleStart}
        autoFocus
        aria-label="Enter Portfolio"
      >
        Explore Portfolio
      </button>

      <span className={styles.pressKeyHint}>
        Press <kbd className={styles.kbd}>Enter</kbd> or click to begin
      </span>
    </div>
  )
}
