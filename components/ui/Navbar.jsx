'use client'

import { useEffect, useRef, useState } from 'react'
import profile from '@/data/profile.json'
import styles from '@/styles/ui/Navbar.module.css'
import { FaBars, FaTimes } from 'react-icons/fa'

import { trackEvent } from '@/lib/analytics'

const NAV_ITEMS = [
  { label: 'Home',        href: '#hero' },
  { label: 'About',       href: '#about' },
  { label: 'Skills',      href: '#skills' },
  { label: 'Projects',    href: '#projects' },
  { label: 'Experience',  href: '#experience' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Contact',     href: '#contact' },
]

function getIST() {
  return new Date().toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).toUpperCase()
}

export default function Navbar() {
  const [time, setTime] = useState(() => getIST())
  const [activeSection, setActiveSection] = useState('hero')
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)

  // Live clock in IST
  useEffect(() => {
    const id = setInterval(() => setTime(getIST()), 1000)
    return () => clearInterval(id)
  }, [])

  // Scroll detection for active section and navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 60)

      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'credentials', 'contact']
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const targetId = href.replace('#', '')
    trackEvent('nav_click', { section: targetId })
    const targetEl = document.getElementById(targetId)
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <span className={styles.time} aria-hidden="true">
          INDIA TIME — {time || 'CALCULATING...'}
        </span>

        <nav className={styles.navMenu} aria-label="Main Navigation">
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ label, href }) => {
              const sectionId = href.replace('#', '')
              const isActive = activeSection === sectionId
              return (
                <li key={label} className={styles.navItem}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <a
          href={`mailto:${profile.email}`}
          className={styles.emailBtn}
          aria-label={`Send email to ${profile.email}`}
          onClick={() => trackEvent('email_click', { email: profile.email, location: 'navbar' })}
        >
          Email me
        </a>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <button
            className={styles.closeBtn}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes size={22} />
          </button>
          <ul className={styles.mobileNavList}>
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className={styles.mobileNavLink}
                  onClick={(e) => handleNavClick(e, href)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${profile.email}`}
            className={styles.mobileMailLink}
            onClick={() => setMenuOpen(false)}
          >
            {profile.email}
          </a>
        </div>
      )}
    </>
  )
}
