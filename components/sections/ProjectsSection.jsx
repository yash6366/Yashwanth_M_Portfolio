'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiArrowUpRight, FiGithub, FiExternalLink, FiLayers } from 'react-icons/fi'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/ProjectsSection.module.css'

const CATEGORIES = ['All', 'Full Stack', 'AI / ML']

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProjectId, setSelectedProjectId] = useState(profile.projects[0]?.id || 1)

  const filteredProjects = activeCategory === 'All'
    ? profile.projects
    : profile.projects.filter(p => p.category === activeCategory)

  const activeProject = filteredProjects.find(p => p.id === selectedProjectId) || filteredProjects[0]

  return (
    <section id="projects" className={styles.section} aria-label="Featured Projects Portfolio">
      {/* Header & Filter Bar */}
      <div className={styles.topBar}>
        <div className={styles.headerTitleWrap}>
          <span className={styles.sectionLabel}>Portfolio Showcase</span>
          <h2 className={styles.sectionHeading}>Engineered with precision.</h2>
        </div>

        <div className={styles.filterBar} role="tablist" aria-label="Filter projects by category">
          {CATEGORIES.map(cat => {
            const isSelected = activeCategory === cat
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveCategory(cat)
                  const firstInCat = (cat === 'All' ? profile.projects : profile.projects.filter(p => p.category === cat))[0]
                  if (firstInCat) setSelectedProjectId(firstInCat.id)
                }}
                className={`${styles.filterBtn} ${isSelected ? styles.filterActive : ''}`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop Showcase View */}
      <div className={styles.desktopShowcase}>
        {/* Project Selector Tabs */}
        <div className={styles.projectListSidebar} role="tablist" aria-orientation="vertical">
          {filteredProjects.map((proj, idx) => {
            const isSelected = activeProject?.id === proj.id
            return (
              <button
                key={proj.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`${styles.projectTab} ${isSelected ? styles.projectTabActive : ''}`}
              >
                <div className={styles.tabHeader}>
                  <span className={styles.tabNumber}>0{idx + 1}</span>
                  <span className={styles.tabType}>{proj.type}</span>
                </div>
                <h3 className={styles.tabTitle}>{proj.title}</h3>
                <p className={styles.tabSubtitle}>{proj.subtitle}</p>
              </button>
            )
          })}
        </div>

        {/* Active Project Feature Card */}
        {activeProject && (
          <article className={styles.featuredDisplay} aria-live="polite">
            <div className={styles.featureVisual}>
              <Image
                src={activeProject.image}
                alt={`${activeProject.title} project graphic`}
                fill
                quality={85}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={styles.featureImg}
                unoptimized={activeProject.image.endsWith('.svg')}
              />
              <div className={styles.featureVisualOverlay} aria-hidden="true" />
            </div>

            <div className={styles.featureDetails}>
              <div className={styles.featureMeta}>
                <span className={styles.typeBadge}>{activeProject.type}</span>
                <span className={styles.categoryBadge}>{activeProject.category}</span>
              </div>

              <h3 className={styles.featureTitle}>{activeProject.title}</h3>
              <p className={styles.featureSubtitle}>{activeProject.subtitle}</p>
              <p className={styles.featureDesc}>{activeProject.desc}</p>

              <dl className={styles.problemSolutionGrid}>
                <div className={styles.specBox}>
                  <dt className={styles.specTitle}>Problem</dt>
                  <dd className={styles.specDesc}>{activeProject.problem}</dd>
                </div>
                <div className={styles.specBox}>
                  <dt className={styles.specTitle}>Solution</dt>
                  <dd className={styles.specDesc}>{activeProject.solution}</dd>
                </div>
                <div className={styles.specBox}>
                  <dt className={styles.specTitle}>Key Learning</dt>
                  <dd className={styles.specDesc}>{activeProject.learning}</dd>
                </div>
                <div className={styles.specBox}>
                  <dt className={styles.specTitle}>Challenge</dt>
                  <dd className={styles.specDesc}>{activeProject.challenge}</dd>
                </div>
              </dl>

              <div className={styles.techStack} aria-label="Technologies used">
                {activeProject.tech.map(t => (
                  <span key={t} className={styles.techPill}>{t}</span>
                ))}
              </div>

              <div className={styles.actionRow}>
                {activeProject.demo && (
                  <a
                    href={activeProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.liveBtn}
                    aria-label={`Open live demo for ${activeProject.title}`}
                  >
                    <span>Live Application</span>
                    <FiExternalLink size={15} />
                  </a>
                )}
                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.githubBtn}
                    aria-label={`View GitHub source code for ${activeProject.title}`}
                  >
                    <FiGithub size={15} />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        )}
      </div>

      {/* Mobile Card Feed (All content fully visible, no truncation/stripping) */}
      <div className={styles.mobileCardFeed}>
        {filteredProjects.map((proj, idx) => (
          <article key={proj.id} className={styles.mobileCard}>
            <div className={styles.mobileCardHeader}>
              <span className={styles.mobileNum}>0{idx + 1}</span>
              <span className={styles.typeBadge}>{proj.type}</span>
            </div>

            <h3 className={styles.mobileTitle}>{proj.title}</h3>
            <p className={styles.mobileSubtitle}>{proj.subtitle}</p>
            <p className={styles.mobileDesc}>{proj.desc}</p>

            <div className={styles.mobileSpecs}>
              <div className={styles.mobileSpecItem}>
                <span className={styles.mobileSpecHeading}>Problem</span>
                <p>{proj.problem}</p>
              </div>
              <div className={styles.mobileSpecItem}>
                <span className={styles.mobileSpecHeading}>Solution</span>
                <p>{proj.solution}</p>
              </div>
            </div>

            <div className={styles.techStack}>
              {proj.tech.map(t => (
                <span key={t} className={styles.techPill}>{t}</span>
              ))}
            </div>

            <div className={styles.actionRow}>
              {proj.demo && (
                <a
                  href={proj.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.liveBtn}
                >
                  <span>Live App</span>
                  <FiExternalLink size={14} />
                </a>
              )}
              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubBtn}
                >
                  <FiGithub size={14} />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
