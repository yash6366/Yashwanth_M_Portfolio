'use client'

import { useState } from 'react'
import Navbar from '@/components/ui/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import WorkExperienceSection from '@/components/sections/WorkExperienceSection'
import CredentialsSection from '@/components/sections/CredentialsSection'
import PublicationsFooterSection from '@/components/sections/PublicationsFooterSection'
import ScreenLoader from '@/components/sections/ScreenLoader'
import styles from '@/styles/page.module.css'

export default function Home() {
  const [showLoader, setShowLoader] = useState(true)

  return (
    <>
      {showLoader && (
        <ScreenLoader onDismiss={() => setShowLoader(false)} />
      )}

      <Navbar />

      <main id="main-content" className={styles.mainWrapper}>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <WorkExperienceSection />
        <CredentialsSection />
        <PublicationsFooterSection />
      </main>
    </>
  )
}
