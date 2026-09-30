'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiExternalLink, FiGithub, FiLayers, FiShield, FiCpu, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { trackEvent } from '@/lib/analytics'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/ProjectsSection.module.css'

const FILTER_TABS = ['Featured', 'All Projects', 'Full Stack', 'AI / ML']

export default function ProjectsSection() {
  const [activeTab, setActiveTab] = useState('Featured')
  const [selectedProjectId, setSelectedProjectId] = useState(profile.projects[0]?.id || 1)
  const [showCaseStudy, setShowCaseStudy] = useState(true)

  const filteredProjects = activeTab === 'Featured'
    ? profile.projects.filter(p => p.featured)
    : activeTab === 'All Projects'
    ? profile.projects
    : profile.projects.filter(p => p.category === activeTab)

  const activeProject = filteredProjects.find(p => p.id === selectedProjectId) || filteredProjects[0] || profile.projects[0]

  return (
    <section id="projects" className={styles.section} aria-label="Featured Projects Portfolio">
      {/* Top Header & Filter Controls */}
      <div className={styles.topBar}>
        <div className={styles.headerTitleWrap}>
          <span className={styles.sectionLabel}>Engineering Portfolio</span>
          <h2 className={styles.sectionHeading}>Built for production.</h2>
        </div>

        <div className={styles.filterBar} role="tablist" aria-label="Filter projects by category">
          {FILTER_TABS.map(tab => {
            const isSelected = activeTab === tab
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveTab(tab)
                  const list = tab === 'Featured'
                    ? profile.projects.filter(p => p.featured)
                    : tab === 'All Projects'
                    ? profile.projects
                    : profile.projects.filter(p => p.category === tab)
                  if (list[0]) setSelectedProjectId(list[0].id)
                }}
                className={`${styles.filterBtn} ${isSelected ? styles.filterActive : ''}`}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop Split Showcase */}
      <div className={styles.desktopShowcase}>
        {/* Project Selector Sidebar */}
        <div className={styles.projectListSidebar} role="tablist" aria-orientation="vertical">
          {filteredProjects.map((proj, idx) => {
            const isSelected = activeProject?.id === proj.id
            return (
              <button
                key={proj.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedProjectId(proj.id)
                  trackEvent('project_tab_select', { project: proj.title })
                }}
                className={`${styles.projectTab} ${isSelected ? styles.projectTabActive : ''}`}
              >
                <div className={styles.tabHeader}>
                  <span className={styles.tabNumber}>0{idx + 1}</span>
                  {proj.featured && <span className={styles.featuredBadge}>FEATURED</span>}
                  <span className={styles.tabType}>{proj.type}</span>
                </div>
                <h3 className={styles.tabTitle}>{proj.title}</h3>
                <p className={styles.tabSubtitle}>{proj.subtitle}</p>
              </button>
            )
          })}
        </div>

        {/* Active Project Feature Card & Architecture Case Study */}
        {activeProject && (
          <article className={styles.featuredDisplay} aria-live="polite">
            {/* Real Browser/Device UI Mockup */}
            <div className={styles.featureVisual}>
              <Image
                src={activeProject.image}
                alt={`${activeProject.title} user interface`}
                fill
                quality={90}
                sizes="(min-width: 1024px) 55vw, 100vw"
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

              {/* Case Study Architecture View (if available) */}
              {activeProject.caseStudy && (
                <div className={styles.caseStudyCard}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCaseStudy(!showCaseStudy)
                      trackEvent('project_case_study_toggle', { project: activeProject.title })
                    }}
                    className={styles.caseStudyToggleBtn}
                    aria-expanded={showCaseStudy}
                  >
                    <span className={styles.caseStudyHeading}>
                      <FiLayers color="var(--accent)" />
                      Architecture &amp; Technical Blueprint
                    </span>
                    {showCaseStudy ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {showCaseStudy && (
                    <div className={styles.caseStudyContent}>
                      <div className={styles.caseStudyRow}>
                        <span className={styles.caseStudyLabel}>
                          <FiCpu size={13} color="var(--accent)" /> Stack Flow:
                        </span>
                        <p className={styles.caseStudyText}>{activeProject.caseStudy.architecture}</p>
                      </div>

                      <div className={styles.caseStudyRow}>
                        <span className={styles.caseStudyLabel}>
                          <FiShield size={13} color="#4ade80" /> Security:
                        </span>
                        <p className={styles.caseStudyText}>{activeProject.caseStudy.security}</p>
                      </div>

                      <div className={styles.caseStudyRow}>
                        <span className={styles.caseStudyLabel}>
                          <FiLayers size={13} color="#38bdf8" /> Engineering:
                        </span>
                        <p className={styles.caseStudyText}>{activeProject.caseStudy.engineering}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Problem / Solution Grid */}
              <dl className={styles.problemSolutionGrid}>
                <div className={styles.specBox}>
                  <dt className={styles.specTitle}>Problem</dt>
                  <dd className={styles.specDesc}>{activeProject.problem}</dd>
                </div>
                <div className={styles.specBox}>
                  <dt className={styles.specTitle}>Solution</dt>
                  <dd className={styles.specDesc}>{activeProject.solution}</dd>
                </div>
              </dl>

              {/* Tech Stack Pills */}
              <div className={styles.techStack} aria-label="Technologies used">
                {activeProject.tech.map(t => (
                  <span key={t} className={styles.techPill}>{t}</span>
                ))}
              </div>

              {/* Direct Links */}
              <div className={styles.actionRow}>
                {activeProject.demo && (
                  <a
                    href={activeProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('project_live_demo', { project: activeProject.title, url: activeProject.demo })}
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
                    onClick={() => trackEvent('project_github', { project: activeProject.title, repo: activeProject.github })}
                    className={styles.githubBtn}
                    aria-label={`View GitHub repository for ${activeProject.title}`}
                  >
                    <FiGithub size={15} />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        )}
      </div>

      {/* Mobile Card Feed */}
      <div className={styles.mobileCardFeed}>
        {filteredProjects.map((proj, idx) => (
          <article key={proj.id} className={styles.mobileCard}>
            {/* Mobile Visual Frame */}
            <div className={styles.mobileVisual}>
              <Image
                src={proj.image}
                alt={`${proj.title} user interface`}
                fill
                quality={85}
                sizes="100vw"
                className={styles.featureImg}
                unoptimized={proj.image.endsWith('.svg')}
              />
            </div>

            <div className={styles.mobileCardHeader}>
              <span className={styles.mobileNum}>0{idx + 1}</span>
              <span className={styles.typeBadge}>{proj.type}</span>
            </div>

            <h3 className={styles.mobileTitle}>{proj.title}</h3>
            <p className={styles.mobileSubtitle}>{proj.subtitle}</p>
            <p className={styles.mobileDesc}>{proj.desc}</p>

            {proj.caseStudy && (
              <div className={styles.mobileCaseStudy}>
                <span className={styles.mobileCaseStudyLabel}>Architecture Blueprint:</span>
                <p className={styles.mobileCaseStudyText}>{proj.caseStudy.architecture}</p>
              </div>
            )}

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
                  onClick={() => trackEvent('project_live_demo', { project: proj.title, url: proj.demo })}
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
                  onClick={() => trackEvent('project_github', { project: proj.title, repo: proj.github })}
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
