'use client'

import { useEffect, useRef } from 'react'
import { FiCloud, FiDatabase, FiLayers, FiMonitor, FiServer, FiCpu } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/SkillsSection.module.css'

const CATEGORY_ICONS = {
  Backend: FiServer,
  Frontend: FiMonitor,
  Database: FiDatabase,
  'AI & ML': FiCpu,
  'Cloud & Tools': FiCloud,
  Concepts: FiLayers,
}

export default function SkillsSection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let hasPlayed = false

    function playAnim() {
      if (hasPlayed) return
      hasPlayed = true

      gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
      gsap.to(cardRefs.current.filter(Boolean), {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.08,
      })
    }

    gsap.set(contentRef.current, { opacity: 0, y: 20 })
    cardRefs.current.forEach((card) => {
      if (card) gsap.set(card, { opacity: 0, y: 20 })
    })

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        playAnim()
      }
    }, { threshold: 0.2 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className={styles.section} aria-label="Core Technical Skills">
      <div ref={contentRef} className={styles.header}>
        <p className={styles.eyebrow}>Core Capabilities</p>
        <h2 className={styles.heading}>Stacked by how I build software.</h2>
        <p className={styles.subcopy}>
          A grouped overview of the programming languages, full-stack frameworks, database systems, AI/ML tools, and deployment environments I work with.
        </p>
      </div>

      <div className={styles.grid}>
        {profile.skillCategories.map((category, index) => {
          const Icon = CATEGORY_ICONS[category.label] ?? FiLayers
          return (
            <article
              key={category.label}
              ref={(el) => { cardRefs.current[index] = el }}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <Icon aria-hidden="true" size={16} />
                <span>{category.label}</span>
              </div>
              <div className={styles.skillTags}>
                {category.skills.map((skill) => (
                  <span key={skill} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}