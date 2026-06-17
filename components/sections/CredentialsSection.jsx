'use client'

import { useEffect, useRef } from 'react'
import { FiAward, FiBookOpen, FiBriefcase, FiDownload, FiMail, FiPhone } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/CredentialsSection.module.css'

const TARGET_ROLES = [
  'Software Developer',
  'Java Developer',
  'Full-Stack Developer',
  'AI/ML Engineer',
]

export default function CredentialsSection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const scroller = document.querySelector('main')
    if (!section || !scroller) return

    let active = false

    function resetAnim() {
      gsap.set(contentRef.current, { opacity: 0, y: 28 })
      cardRefs.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 0, y: 24 })
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
        delay: 0.12,
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

  const completedCertifications = profile.certifications.filter((cert) => cert.status !== 'In Progress')
  const inProgressCertification = profile.certifications.find((cert) => cert.status === 'In Progress')

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={contentRef} className={styles.header}>
        <p className={styles.eyebrow}>Recruiter Snapshot</p>
        <h2 className={styles.heading}>Education, certifications, and proof of momentum.</h2>
        <p className={styles.subcopy}>
          Built for entry-level screening: academic background, verified learning paths,
          internship completion, and target roles are visible in one focused section.
        </p>
        <div className={styles.roleRow}>
          {TARGET_ROLES.map((role) => (
            <span key={role} className={styles.rolePill}>{role}</span>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        <article
          ref={(el) => { cardRefs.current[0] = el }}
          className={`${styles.card} ${styles.educationCard}`}
        >
          <div className={styles.cardTop}>
            <FiBookOpen aria-hidden />
            <span>Education</span>
          </div>
          <div className={styles.educationList}>
            {profile.education.map((education) => (
              <div key={`${education.degree}-${education.institution}`} className={styles.educationItem}>
                <h3 className={styles.cardTitle}>{education.degree}</h3>
                <p className={styles.cardSubtitle}>{education.institution}</p>
                <div className={styles.educationMeta}>
                  <span>{education.year}</span>
                  <span>{education.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article
          ref={(el) => { cardRefs.current[1] = el }}
          className={`${styles.card} ${styles.certCard}`}
        >
          <div className={styles.cardTop}>
            <FiAward aria-hidden />
            <span>Certifications</span>
          </div>
          <div className={styles.certList}>
            {completedCertifications.map((cert) => (
              <div key={cert.title} className={styles.certItem}>
                <span className={styles.certTitle}>{cert.title}</span>
                <span className={styles.certIssuer}>{cert.issuer} - {cert.category}</span>
              </div>
            ))}
          </div>
          {inProgressCertification && (
            <div className={styles.inProgressBanner}>
              <div>
                <span className={styles.inProgressLabel}>In Progress</span>
                <h4 className={styles.inProgressTitle}>{inProgressCertification.title}</h4>
                <p className={styles.inProgressIssuer}>{inProgressCertification.issuer}</p>
              </div>
              <span className={styles.inProgressBadge}>{inProgressCertification.status}</span>
            </div>
          )}
        </article>

        <article
          ref={(el) => { cardRefs.current[2] = el }}
          className={`${styles.card} ${styles.achievementCard}`}
        >
          <div className={styles.cardTop}>
            <FiBriefcase aria-hidden />
            <span>Achievements</span>
          </div>
          <ul className={styles.achievementList}>
            {profile.achievements.map((achievement) => (
              <li key={achievement}>{achievement}</li>
            ))}
          </ul>
          <div className={styles.ctaRow}>
            <a href={profile.resume.href} className={styles.resumeBtn} download>
              <FiDownload aria-hidden />
              {profile.resume.label}
            </a>
            <div className={styles.contactLinks}>
              <a href={`mailto:${profile.email}`} className={styles.contactLink}>
                <FiMail aria-hidden />
                {profile.email}
              </a>
              <a href={profile.tel} className={styles.contactLink}>
                <FiPhone aria-hidden />
                {profile.phone}
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
