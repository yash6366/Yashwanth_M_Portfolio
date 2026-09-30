'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import content from '@/data/content.json'
import styles from '@/styles/sections/VideoIntro.module.css'

const CinematicLayer = dynamic(() => import('@/components/three/CinematicLayer'), { ssr: false })

export default function VideoIntro() {
  const sectionRef  = useRef(null)
  const videoRef    = useRef(null)
  const greetRef    = useRef(null)
  const nameRef     = useRef(null)
  const roleRef     = useRef(null)
  const scrollRef   = useRef(null)
  const hintRef     = useRef(null)

  const [muted,    setMuted]    = useState(true)
  const [playing,  setPlaying]  = useState(true)
  const [showHint, setShowHint] = useState(true)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)

  function scrollToHero() {
    const hero = document.getElementById('hero')
    if (hero) hero.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Entrance animation
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tl = gsap.timeline({ delay: 0.2 })
    tl.fromTo(greetRef.current,  { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .fromTo(nameRef.current,   { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2')
      .fromTo(roleRef.current,   { opacity: 0, y:  16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .fromTo(scrollRef.current, { opacity: 0 },         { opacity: 1, duration: 0.4 }, '-=0.1')
    return () => tl.kill()
  }, [])

  // Auto-pause video when out of viewport
  useEffect(() => {
    const v = videoRef.current
    const section = sectionRef.current
    if (!v || !section) return

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (playing) v.play().catch(() => {})
      } else {
        v.pause()
      }
    }, { threshold: 0.2 })

    io.observe(section)
    return () => io.disconnect()
  }, [playing])

  // Loader dismissed event
  useEffect(() => {
    function onLoaderDismissed() {
      const v = videoRef.current
      if (!v) return
      v.muted = false
      setMuted(false)
      setShowHint(false)
    }
    window.addEventListener('loader-dismissed', onLoaderDismissed)
    return () => window.removeEventListener('loader-dismissed', onLoaderDismissed)
  }, [])

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (playing) {
      v.pause()
      setPlaying(false)
    } else {
      v.play()
      setPlaying(true)
    }
  }

  function toggleMute() {
    setShowHint(false)
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <section id="intro" ref={sectionRef} className={styles.section} aria-label="Cinematic Introduction">
      {/* 1 - Blurred ambient background video */}
      <video
        src="/assets/about-me.mp4"
        autoPlay muted playsInline loop
        aria-hidden="true"
        className={styles.bgVideo}
      />

      {/* 2 - Main video */}
      <video
        ref={videoRef}
        data-testid="intro-video"
        src="/assets/about-me.mp4"
        muted playsInline loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={styles.mainVideo}
      />

      {/* 3 - Gradient overlay */}
      <div className={styles.overlay} />

      {/* 4 - Three.js bokeh layer */}
      {!isMobile && <CinematicLayer />}

      {/* 5 - Landing content */}
      <div className={styles.heroContent}>
        <p ref={greetRef} className={styles.eyebrow}>{content.site.tagline}</p>
        <h1 ref={nameRef} className={styles.name}>
          {profile.name.first}<br />{profile.name.last}
        </h1>
        <p ref={roleRef} className={styles.role}>{profile.roles.detailed}</p>

        <div className={styles.introCtas}>
          <button
            onClick={scrollToHero}
            className={styles.skipBtn}
            aria-label="Skip video intro and view portfolio details"
          >
            Explore Profile ↓
          </button>
        </div>
      </div>

      {/* 6 - Play overlay when paused */}
      {!playing && (
        <button
          className={styles.playOverlay}
          onClick={togglePlay}
          aria-label="Play video"
        >
          <svg width="68" height="68" viewBox="0 0 72 72" fill="none" aria-hidden="true">
            <circle cx="36" cy="36" r="35" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
            <polygon points="29,20 56,36 29,52" fill="white" />
          </svg>
        </button>
      )}

      {/* 7 - Sound hint badge */}
      {showHint && (
        <div
          ref={hintRef}
          className={styles.soundHint}
          onClick={toggleMute}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleMute()}
          aria-label="Unmute video sound"
        >
          <span className={styles.soundPulse} />
          <span>Tap for sound</span>
        </div>
      )}

      {/* 8 - Media controls */}
      <div className={styles.controls}>
        <button
          className={styles.ctrlBtn}
          onClick={togglePlay}
          aria-label={playing ? 'Pause video' : 'Play video'}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <rect x="2" y="1" width="4" height="12" rx="1" />
              <rect x="8" y="1" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <polygon points="2,1 13,7 2,13" />
            </svg>
          )}
        </button>

        <button
          className={styles.ctrlBtn}
          onClick={toggleMute}
          aria-label={muted ? 'Unmute video audio' : 'Mute video audio'}
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
              <path d="M2 5.5h2.5L8 3v10l-3.5-2.5H2V5.5z" fill="currentColor" stroke="none" />
              <line x1="10" y1="5" x2="14" y2="11" />
              <line x1="14" y1="5" x2="10" y2="11" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
              <path d="M2 5.5h2.5L8 3v10l-3.5-2.5H2V5.5z" fill="currentColor" stroke="none" />
              <path d="M10.5 5.5C11.8 6.5 12.5 7.2 12.5 8s-.7 1.5-2 2.5" />
              <path d="M12 3.5C14 5 15 6.4 15 8s-1 3-3 4.5" />
            </svg>
          )}
        </button>
      </div>

      {/* 9 - Scroll Cue */}
      <button
        ref={scrollRef}
        className={styles.scrollCue}
        onClick={scrollToHero}
        aria-label="Scroll to main overview"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </button>
    </section>
  )
}
