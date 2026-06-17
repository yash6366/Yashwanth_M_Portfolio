'use client'

import { useEffect, useRef } from 'react'
import { FiCloud, FiDatabase, FiLayers, FiMonitor, FiServer } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/SkillsSection.module.css'

const CATEGORY_ICONS = {
  Backend: FiServer,
  Frontend: FiMonitor,
  Database: FiDatabase,
  'Cloud & Tools': FiCloud,
  Concepts: FiLayers,
}

export default function SkillsSection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const scroller = document.querySelector('main')
    if (!section || !scroller) return

    let active = false

    function resetAnim() {
      gsap.set(contentRef.current, { opacity: 0, y: 26 })
      cardRefs.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 0, y: 22 })
      })
    }

    function playAnim() {
      resetAnim()
      gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' })
      gsap.to(cardRefs.current.filter(Boolean), {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.1,
      })
    }

    resetAnim()

    function onScroll() {
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.55
      if (inRange && !active) {
        active = true
        playAnim()
      }
      if (!inRange && active) {
        active = false
        resetAnim()
      }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={contentRef} className={styles.header}>
        <p className={styles.eyebrow}>Core Skills</p>
        <h2 className={styles.heading}>Stacked by how I actually build.</h2>
        <p className={styles.subcopy}>
          A grouped view of the tools, languages, and concepts that shape my day-to-day work.
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
                <Icon aria-hidden />
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