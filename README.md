# Yashwanth M — Professional Developer Portfolio

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15%2B%20%2F%2016-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**A high-performance, cinematic, 3D interactive portfolio built for Yashwanth M — Software Developer, Full-Stack Engineer, and AI/ML Enthusiast.**

[🌐 Live Demo](https://yashwanthm.dev) • [📄 View Resume](public/resume/Yashwanth-M-Resume.pdf) • [📫 Get in Touch](mailto:yashwanthm2408@gmail.com)

</div>

---

## 🌟 Overview

This repository houses the modern portfolio of **Yashwanth M**, a 2026 Computer Science & Engineering graduate from Bengaluru, India. Engineered with **Next.js App Router**, **React 19**, **GSAP**, and **Three.js**, it features a smooth step-driven scroll navigation, real-time 3D canvas visuals, dynamic case studies, and a centralized JSON-driven architecture.

---

## ✨ Key Features

- 🎬 **Cinematic Step-Driven Scroll**: Custom GSAP-orchestrated section transitions (`goTo(idx)`) delivering a smooth, app-like narrative experience without native scroll-snap jank.
- 🌌 **Interactive 3D WebGL Backgrounds**: Dynamic Three.js canvas layer featuring particle fields and responsive physics-inspired shaders (`HeroBackground`).
- 💼 **Interactive Experience & Project Showcase**:
  - Deep-dive case studies for flagship projects (**TestTrack Pro**, **YM-Pay**, **VakCare**, **BTMS**).
  - Categorized engineering projects spanning Full-Stack, Java Backend, and AI/NLP systems.
  - Interactive internship timeline (**BHEL**, **Edunet Foundation**, **Indpro**).
- 🎓 **Credentials & Certifications Hub**: Showcases academic history, Google / NPTEL / AICTE certifications, hackathon participation, and technical skills.
- ⚡ **Zero-Hardcode Data Architecture**: All biography, skills, projects, achievements, and social metadata are centralized in [`data/profile.json`](file:///d:/Projects/Yash-portfolio/data/profile.json) for instant updates.
- 📱 **Fully Responsive & Accessible**: Optimized across mobile, tablet, ultra-wide displays, and high-DPI viewports with semantic HTML and accessible ARIA attributes.
- 🚀 **SEO & Performance Tuned**: OpenGraph tags, structured JSON-LD schemas, next/font optimization (Geist, Baloo 2, Dancing Script), and zero layout-shift asset loading.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | Server Components, dynamic client boundaries |
| **UI Library** | [React 19](https://react.dev/) | Modern hooks, transitions, and concurrent rendering |
| **Motion & Scroll** | [GSAP 3](https://greensock.com/gsap/) + ScrollTrigger | Smooth programmatic scroll, stagger animations |
| **3D & WebGL** | [Three.js](https://threejs.org/) | Particle meshes, camera controls, custom shaders |
| **Styling** | CSS Modules + Tailwind CSS v4 | Scoped styles with global design tokens (`globals.css`) |
| **Icons & Typography** | `react-icons` + `next/font` | Feather/Lucide/Simple icons; Geist, Baloo 2, Dancing Script |
| **Analytics & Hosting** | Vercel | Vercel Edge Network, Web Analytics, Speed Insights |

---

## 📁 Project Structure

```text
├── app/
│   ├── globals.css           # Global design tokens, themes & resets
│   ├── layout.js             # Root layout with fonts, metadata & analytics
│   ├── page.js               # Main portfolio canvas & GSAP scroll controller
│   └── sitemap.js            # Dynamic SEO sitemap generator
├── components/
│   ├── sections/             # Page sections
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── SkillsSection.jsx
│   │   ├── WorkExperienceSection.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── CredentialsSection.jsx
│   │   └── PublicationsFooterSection.jsx
│   ├── three/                # Three.js 3D canvas modules
│   │   └── HeroBackground.jsx
│   └── ui/                   # Reusable UI primitives
├── data/
│   └── profile.json          # Single source of truth for all content & bio
├── lib/
│   ├── gsap.js               # GSAP configuration & plugin registration
│   └── siteConfig.js         # Production canonical URL and domain settings
├── public/
│   ├── assets/projects/      # Project mockups and preview SVGs/images
│   └── resume/               # Yashwanth-M-Resume.pdf
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.18.0` or higher (Node `20+` recommended)
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yash6366/Yashwanth_M_Portfolio.git
   cd Yashwanth_M_Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the live site.

---

## ⚙️ Customization & Configuration

### 1. Update Portfolio Content
All text, statistics, career milestones, certifications, and project records reside in [`data/profile.json`](file:///d:/Projects/Yash-portfolio/data/profile.json). Simply modify this file to update the site's content.

### 2. Resume PDF
Place your updated resume file at:
```text
public/resume/Yashwanth-M-Resume.pdf
```
Links across the Hero, Credentials, and Footer sections automatically reference this path.

### 3. Project Mockups & Visuals
Store project screenshots or SVGs under `public/assets/projects/` matching the project IDs or image paths configured in `profile.json`:
- Recommended dimensions: `1600x900 px`
- Formats: `.webp`, `.png`, or `.svg` (optimally `< 300 KB`)

### 4. Domain & Deployment URL
Before deploying to production, set your canonical URL in [`lib/siteConfig.js`](file:///d:/Projects/Yash-portfolio/lib/siteConfig.js):
```javascript
export const SITE_URL = 'https://your-domain.com';
```

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with hot reload |
| `npm run build` | Compiles and builds the production bundle |
| `npm run start` | Runs the built production server locally |
| `npm run lint` | Runs ESLint to identify code quality and style issues |

---

## 📬 Contact & Connect

**Yashwanth M**  
Bengaluru, Karnataka, India

- **Email**: [yashwanthm2408@gmail.com](mailto:yashwanthm2408@gmail.com)
- **LinkedIn**: [linkedin.com/in/yashwanth-m24](https://www.linkedin.com/in/yashwanth-m24/)
- **GitHub**: [github.com/yash6366](https://github.com/yash6366)
- **Portfolio**: [yashwanthm.dev](https://yashwanthm.dev)

---

<div align="center">
  <sub>Designed & Developed with ❤️ by Yashwanth M. Powered by Next.js & Three.js.</sub>
</div>
