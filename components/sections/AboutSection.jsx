'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/AboutSection.module.css'

const BIO = profile.bio
const WHO_ITEMS = profile.skills
const ICON_MAP = { GitHub: FaGithub, LinkedIn: FaLinkedinIn }
const SOCIALS = profile.socials.map(s => ({ Icon: ICON_MAP[s.label] || FaGithub, href: s.href, label: s.label }))

export default function AboutSection() {
  const sectionRef  = useRef(null)
  const photoRef    = useRef(null)
  const contentRef  = useRef(null)
  const socialsRef  = useRef(null)
  const intervalRef = useRef(null)

  const [typed, setTyped] = useState(0)
  const [done,  setDone]  = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let hasPlayed = false

    function playAnim() {
      if (hasPlayed) return
      hasPlayed = true

      if (prefersReducedMotion) {
        setTyped(BIO.length)
        setDone(true)
        gsap.set(photoRef.current, { opacity: 1, x: 0 })
        gsap.set(contentRef.current, { opacity: 1, y: 0 })
        const socialIcons = socialsRef.current?.querySelectorAll('a') ?? []
        gsap.set(socialIcons, { opacity: 1, y: 0 })
        return
      }

      gsap.to(photoRef.current, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' })
      gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 })
      const socialIcons = socialsRef.current?.querySelectorAll('a') ?? []
      gsap.to(socialIcons, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08, delay: 0.3 })

      let i = 0
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        i = Math.min(i + 8, BIO.length)
        setTyped(i)
        if (i >= BIO.length) {
          clearInterval(intervalRef.current)
          setDone(true)
        }
      }, 16)
    }

    // Initial state
    gsap.set(photoRef.current, { opacity: 0, x: -30 })
    gsap.set(contentRef.current, { opacity: 0, y: 30 })

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        playAnim()
      }
    }, { threshold: 0.25 })

    observer.observe(section)

    return () => {
      observer.disconnect()
      clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} className={styles.section} aria-label="About Yashwanth M">

      {/* Screen Reader Full Bio */}
      <p className="sr-only">{BIO}</p>

      {/* ── Left: photo + signature + socials ───────── */}
      <div ref={photoRef} className={styles.photoCol}>
        <div className={styles.photoWrap}>
          <div className={styles.photoFrame} data-about-photo>
            <Image
              src="/assets/me.webp"
              alt={profile.name.full}
              fill
              quality={85}
              sizes="(min-width: 768px) 30vw, 100vw"
              className={styles.photoImg}
            />
          </div>
          <p className={styles.signature} aria-hidden="true">{profile.name.first}</p>
        </div>

        {/* Social icons */}
        <div ref={socialsRef} className={styles.socials} aria-label="Social profiles">
          {SOCIALS.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${label} Profile`}
              className={styles.socialLink}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* ── Right: content ───────────────────────────── */}
      <div ref={contentRef} className={styles.content}>

        {/* Who I Am - label + marquee */}
        <p className={styles.whoLabel}>Who I Am</p>
        <div className={styles.marqueeWrap} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            {[...WHO_ITEMS, ...WHO_ITEMS].map((item, i) => (
              <span key={i} className={styles.marqueeItem}>
                {item}
                <span className={styles.marqueeDot}>•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Visual bio text */}
        <div className={styles.bioWrap} aria-hidden="true">
          <p className={styles.bio}>
            {BIO.split('').map((char, i) => (
              <span
                key={i}
                className={
                  i < typed
                    ? (i === typed - 1 && !done ? styles.lastTyped : styles.typed)
                    : styles.untyped
                }
              >
                {char}
              </span>
            ))}
          </p>
        </div>

      </div>
    </section>
  )
}
