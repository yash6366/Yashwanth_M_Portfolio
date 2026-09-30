'use client'

import { useEffect, useRef, useState, Fragment } from 'react'
import Image from 'next/image'
import * as THREE from 'three'
import { gsap } from '@/lib/gsap'
import {
  FaGithub, FaLinkedinIn, FaInstagram, FaYoutube, FaEnvelope,
} from 'react-icons/fa'
import { FiArrowUpRight, FiChevronDown, FiCopy, FiCheck } from 'react-icons/fi'
import profile from '@/data/profile.json'
import content from '@/data/content.json'
import styles from '@/styles/sections/PublicationsFooterSection.module.css'

const SOCIAL_ICONS = {
  GitHub:    <FaGithub    size={13} />,
  LinkedIn:  <FaLinkedinIn  size={13} />,
  Instagram: <FaInstagram size={13} />,
  YouTube:   <FaYoutube   size={13} />,
}

const MOBILE_SOCIAL_ICONS = {
  GitHub:    <FaGithub    size={20} />,
  LinkedIn:  <FaLinkedinIn  size={20} />,
  Instagram: <FaInstagram size={20} />,
}
const HERO_SOCIAL_LABELS = ['GitHub', 'LinkedIn', 'Instagram']

const VID_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const VID_FRAG = `
  uniform sampler2D uVideo;
  uniform float uOpacity;
  uniform float uVideoAspect;
  uniform float uCanvasAspect;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    if (uCanvasAspect > uVideoAspect) {
      float s = uVideoAspect / uCanvasAspect;
      uv.y = (vUv.y - 0.5) * s + 0.5;
    } else {
      float s = uCanvasAspect / uVideoAspect;
      uv.x = (vUv.x - 0.5) * s + 0.5;
    }
    vec4 tex = texture2D(uVideo, uv);
    float fadeY =
      smoothstep(0.0, 0.05, uv.y) *
      smoothstep(1.0, 0.95, uv.y);
    float alpha = fadeY * uOpacity;
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 col = mix(vec3(lum), tex.rgb, 0.72);
    float vx = smoothstep(0.0, 0.38, abs(uv.x - 0.5) * 2.0);
    vec3 dark = vec3(0.008, 0.008, 0.008);
    col = mix(col, dark, vx * 0.82);
    col *= 0.68;
    gl_FragColor = vec4(col, alpha);
  }
`

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export default function PublicationsFooterSection() {
  const wrapperRef = useRef(null)
  const stickyRef  = useRef(null)

  // image
  const imageWrapRef    = useRef(null)
  const imageOverlayRef = useRef(null)

  // contact / pub content
  const pubContentRef = useRef(null)
  const labelRef      = useRef(null)
  const headingRef    = useRef(null)
  const dividerRef    = useRef(null)
  const itemRefs      = useRef([])

  // image-only interstitial
  const interstitialRef = useRef(null)

  // footer
  const canvasRef         = useRef(null)
  const videoSrcRef       = useRef(null)
  const footerContentRef  = useRef(null)
  const leftRef         = useRef(null)
  const rightRef        = useRef(null)
  const bigNameRef      = useRef(null)
  const bottomBarRef    = useRef(null)

  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  useEffect(() => {
    const wrapper       = wrapperRef.current
    const sticky        = stickyRef.current
    const canvas        = canvasRef.current
    const videoEl       = videoSrcRef.current
    if (!wrapper || !sticky) return

    const isMobile = window.innerWidth < 768
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer, vidUni, rafId, videoPlaying = false, isVisible = true
    let onMouseMove = () => {}, onResize = () => {}

    if (!isMobile && !prefersReducedMotion && canvas && videoEl) {
      // ── Three.js video setup ────────────────────────────────
      const W = sticky.offsetWidth || window.innerWidth
      const H = sticky.offsetHeight || window.innerHeight

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(W, H)
      renderer.setClearColor(0x000000, 0)

      const scene  = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 100)
      camera.position.z = 10

      videoEl.src       = '/assets/footer-video.mp4'
      videoEl.muted     = true
      videoEl.playsInline = true
      videoEl.loop      = true
      videoEl.preload   = 'none'

      const vidTex = new THREE.VideoTexture(videoEl)
      vidTex.minFilter = THREE.LinearFilter
      vidTex.magFilter = THREE.LinearFilter

      vidUni = {
        uVideo:       { value: vidTex },
        uOpacity:     { value: 0 },
        uVideoAspect: { value: 16 / 9 },
        uCanvasAspect: { value: W / H },
      }
      videoEl.addEventListener('loadedmetadata', () => {
        if (videoEl.videoWidth && videoEl.videoHeight)
          vidUni.uVideoAspect.value = videoEl.videoWidth / videoEl.videoHeight
      }, { once: true })

      const vidMat = new THREE.ShaderMaterial({
        uniforms: vidUni,
        vertexShader: VID_VERT,
        fragmentShader: VID_FRAG,
        transparent: true,
      })
      const vidMesh = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.08, H * 1.08), vidMat)
      vidMesh.position.z = 1
      scene.add(vidMesh)

      const mx = { tx: 0, ty: 0, x: 0, y: 0 }
      onMouseMove = function(e) {
        const r = sticky.getBoundingClientRect()
        mx.tx = (e.clientX - r.left) / r.width  - 0.5
        mx.ty = (e.clientY - r.top)  / r.height - 0.5
      }
      sticky.addEventListener('mousemove', onMouseMove)

      onResize = function() {
        const w = sticky.offsetWidth
        const h = sticky.offsetHeight
        renderer.setSize(w, h)
        camera.left   = -w / 2; camera.right  = w / 2
        camera.top    =  h / 2; camera.bottom = -h / 2
        camera.updateProjectionMatrix()
        vidUni.uCanvasAspect.value = w / h
      }
      window.addEventListener('resize', onResize)

      function tick() {
        if (isVisible) {
          mx.x += (mx.tx - mx.x) * 0.04
          mx.y += (mx.ty - mx.y) * 0.04
          vidMesh.position.x = mx.x * 14
          vidMesh.position.y = mx.y * -8
          vidTex.needsUpdate = true
          renderer.render(scene, camera)
        }
        rafId = requestAnimationFrame(tick)
      }
      tick()
    }

    // ── Contact entry animation ───────────────────────────
    let pubAnimDone = false

    function resetPubAnim() {
      pubAnimDone = false
      gsap.set(labelRef.current,   { opacity: 0, y: -16, rotateX: 40, transformPerspective: 500, transformOrigin: '50% 0%' })
      gsap.set(headingRef.current, { opacity: 0, y: -30, rotateX: 35, transformPerspective: 700, transformOrigin: '50% 0%' })
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: 'left center' })
      itemRefs.current.forEach(el => {
        if (el) gsap.set(el, { opacity: 0, y: 28, rotateX: 18, transformPerspective: 900, transformOrigin: '50% 0%' })
      })
    }

    function playPubAnim() {
      if (pubAnimDone) return
      pubAnimDone = true
      gsap.to(labelRef.current,   { opacity: 1, y: 0, rotateX: 0, duration: 0.55, ease: 'power3.out' })
      gsap.to(headingRef.current, { opacity: 1, y: 0, rotateX: 0, duration: 0.75, ease: 'expo.out', delay: 0.08 })
      gsap.to(dividerRef.current, { scaleX: 1, duration: 0.7, ease: 'power2.inOut', delay: 0.25 })
      itemRefs.current.forEach((el, i) => {
        if (el) gsap.to(el, { opacity: 1, y: 0, rotateX: 0, duration: 0.6, ease: 'power3.out', delay: 0.32 + i * 0.1 })
      })
    }

    // ── Initial image position ───────
    function setImageLeft() {
      const vw = window.innerWidth
      gsap.set(imageWrapRef.current, { width: vw, x: 0, opacity: 1 })
      if (imageOverlayRef.current) gsap.set(imageOverlayRef.current, { opacity: 1 })
    }

    // ── Scroll-driven animation (works with native browser scrolling) ──
    function onScroll() {
      const vh   = window.innerHeight
      const rect = wrapper.getBoundingClientRect()
      const dist = -rect.top

      // Visibility for RAF optimization
      isVisible = rect.bottom > 0 && rect.top < window.innerHeight

      if (dist > -vh * 0.5 && dist < vh * 0.35) {
        playPubAnim()
      } else if (dist < -vh * 0.4) {
        resetPubAnim()
        setImageLeft()
      }

      const p = Math.max(0, Math.min(1, dist / (2 * vh)))

      // Phase 1: Contact text fades out
      const pubFadeEnd = isMobile ? 0.25 : 0.28
      const pubFade = 1 - Math.max(0, Math.min(1, p / pubFadeEnd))
      gsap.set(pubContentRef.current, { opacity: pubFade, pointerEvents: pubFade > 0.05 ? 'auto' : 'none' })

      const vw = window.innerWidth

      if (isMobile) {
        const interIn  = Math.max(0, Math.min(1, (p - 0.28) / 0.17))
        const interOut = Math.max(0, Math.min(1, (p - 0.60) / 0.12))
        gsap.set(interstitialRef.current, { opacity: interIn * (1 - interOut), pointerEvents: 'none' })
      } else {
        const imgRaw = Math.max(0, Math.min(1, (p - 0.12) / 0.53))
        const imgP   = easeInOut(imgRaw)

        const startW  = vw
        const endW    = vw * 0.46
        const w       = startW + imgP * (endW - startW)
        const centerX = imgP * (vw - w) / 2

        if (imageOverlayRef.current) {
          gsap.set(imageOverlayRef.current, { opacity: 1 - imgP })
        }

        const interIn  = Math.max(0, Math.min(1, (p - 0.25) / 0.15))
        const interOut = Math.max(0, Math.min(1, (p - 0.54) / 0.14))
        gsap.set(interstitialRef.current, { opacity: interIn * (1 - interOut), pointerEvents: 'none' })

        const xfadeRaw = Math.max(0, Math.min(1, (p - 0.65) / 0.27))
        const xfade    = 0.5 - 0.5 * Math.cos(Math.PI * xfadeRaw)

        gsap.set(imageWrapRef.current, { width: w, x: centerX, opacity: 1 - xfade })
        if (vidUni) vidUni.uOpacity.value = xfade

        if (videoEl) {
          if (xfade > 0.04 && !videoPlaying) {
            videoPlaying = true
            videoEl.play().catch(() => {})
          } else if (xfade <= 0.04 && videoPlaying) {
            videoPlaying = false
            videoEl.pause()
            videoEl.currentTime = 0
          }
        }
      }

      // Footer text fades in
      const footerStart = isMobile ? 0.72 : 0.75
      const footerRange = isMobile ? 0.20 : 0.25
      const footerFade = Math.max(0, Math.min(1, (p - footerStart) / footerRange))
      gsap.set(footerContentRef.current, { opacity: footerFade, pointerEvents: footerFade > 0.05 ? 'auto' : 'none' })
    }

    resetPubAnim()
    setImageLeft()
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      sticky.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (renderer) renderer.dispose()
    }
  }, [])

  const year = new Date().getFullYear()

  return (
    <div id="contact" ref={wrapperRef} className={styles.wrapper}>
      <div ref={stickyRef} className={styles.sticky}>

        {/* ── Video canvas (footer background - desktop) ── */}
        <canvas ref={canvasRef} className={styles.glCanvas} aria-hidden="true" />
        <video ref={videoSrcRef} className={styles.hiddenVideo} aria-hidden="true" />

        {/* ── Mobile background image ── */}
        <div className={styles.mobileFooterBg} aria-hidden="true">
          <Image
            src="/assets/footer.webp"
            alt=""
            fill
            quality={80}
            className={styles.mobileFooterBgImg}
            sizes="100vw"
            priority={false}
          />
        </div>

        {/* ── Mobile permanent dark overlay ── */}
        <div className={styles.mobileDarkOverlay} aria-hidden="true" />

        {/* ── Floating image ── */}
        <div ref={imageWrapRef} className={styles.imageWrap} aria-hidden="true">
          <Image
            src="/assets/footer.webp"
            alt=""
            fill
            quality={80}
            className={styles.imageEl}
            sizes="(max-width: 767px) 100vw, 50vw"
            priority={false}
          />
          <div ref={imageOverlayRef} className={styles.imageOverlay} />
        </div>

        {/* ── Contact content ── */}
        <div ref={pubContentRef} className={styles.pubContent}>
          <span className={styles.watermark} aria-hidden="true">CONTACT</span>

          <div className={styles.pubHero}>
            <p  ref={labelRef}   className={styles.label}>Next Step</p>
            <h2 ref={headingRef} className={styles.heading}>Let&apos;s Connect</h2>
          </div>

          <div ref={dividerRef} className={styles.divider} />

          <div className={styles.contactPanel}>
            {[
              ['Email', profile.email],
              ['Phone', profile.phone],
              ['Location', profile.location.based],
              ['Availability', profile.location.availability],
            ].map(([label, value], i) => (
              <div
                key={label}
                ref={el => { itemRefs.current[i] = el }}
                className={styles.contactItem}
              >
                <span className={styles.contactNum}>0{i + 1}.</span>
                <div>
                  <span className={styles.contactLabel}>{label}</span>
                  {label === 'Email' ? (
                    <div className={styles.emailRow}>
                      <a href={`mailto:${profile.email}`} className={styles.contactValueLink}>{value}</a>
                      <button
                        type="button"
                        onClick={copyEmail}
                        className={styles.copyBtn}
                        aria-label="Copy email address"
                        title={copied ? "Email copied!" : "Copy email"}
                      >
                        {copied ? <FiCheck size={14} color="#4ade80" /> : <FiCopy size={14} />}
                        <span className={styles.copyTooltip}>{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  ) : label === 'Phone' ? (
                    <a href={profile.tel} className={styles.contactValueLink}>{value}</a>
                  ) : (
                    <p className={styles.contactValue}>{value}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={el => { itemRefs.current[3] = el }} className={styles.contactActions}>
              <a href={`mailto:${profile.email}`} className={styles.contactPrimary}>
                Email Me <FiArrowUpRight size={13} aria-hidden="true" />
              </a>
              <a href={profile.resume.href} className={styles.contactSecondary} download>
                {profile.resume.label}
              </a>
            </div>
          </div>
        </div>

        {/* ── Image-only interstitial (step 2) ── */}
        <div ref={interstitialRef} className={styles.interstitial} aria-hidden="true">

          <div className={styles.interstitialLeft}>
            <div className={styles.interStat}>
              <span className={styles.interLabel}>{content.interstitial.availabilityLabel}</span>
              <span className={styles.interBig}>{profile.location.availability}</span>
            </div>
            <div className={styles.interDividerH} />
            <div className={styles.interStat}>
              <span className={styles.interLabel}>{content.interstitial.basedInLabel}</span>
              <span className={styles.interBig}>{profile.location.based}</span>
            </div>
          </div>

          <div className={styles.interstitialRight}>
            {profile.stats.map((stat, i) => (
              <Fragment key={stat.label}>
                {i > 0 && <div className={styles.interDividerV} />}
                <div className={styles.interNum}>
                  <span className={styles.interCount}>{stat.value}</span>
                  <span className={styles.interNumLabel}>
                    {(content.interstitial.statLabels[i] ?? stat.label).split('\n').map((line, j) => (
                      <Fragment key={j}>{line}{j === 0 && <br />}</Fragment>
                    ))}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>

          <div className={styles.interstitialBottom}>
            <span className={styles.interScrollText}>Continue</span>
            <span className={styles.interScrollLine} />
          </div>

        </div>

        {/* ── Radial vignette (footer phase) ── */}
        <div className={styles.vignetteOverlay} aria-hidden="true" />

        {/* ── Footer content ── */}
        <div ref={footerContentRef} className={styles.footerContent}>

          {/* ── Mobile: hero-like layout ── */}
          <div className={styles.mobileLayout}>
            <div className={styles.mobileBrand}>
              <span className={styles.mobileRoleDot} />
              <span className={styles.mobileRoleText}>{profile.roles.short.toUpperCase()}</span>
            </div>
            <h2 className={styles.mobileName}>
              {profile.name.first.toUpperCase()}
              <br />
              <span className={styles.mobileNameGhost}>{profile.name.last.toUpperCase()}</span>
            </h2>
            <p className={styles.mobileDesc}>{profile.description}</p>
            <div className={styles.mobileCtas}>
              <a href={`mailto:${profile.email}`} className={styles.mobileTalkBtn}>
                Let&apos;s talk <FiArrowUpRight aria-hidden="true" />
              </a>
            </div>
            <div className={styles.mobileSocialRow}>
              {HERO_SOCIAL_LABELS.map((label, i) => {
                const s = profile.socials.find(s => s.label === label)
                if (!s) return null
                return (
                  <Fragment key={label}>
                    {i > 0 && <div className={styles.mobileSocialDivider} aria-hidden="true" />}
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.mobileSocialLink} aria-label={label}>
                      <span className={styles.mobileSocialIconEl}>{MOBILE_SOCIAL_ICONS[label]}</span>
                      <span className={styles.mobileSocialLabelEl}>{label.toUpperCase()}</span>
                    </a>
                  </Fragment>
                )
              })}
            </div>
            <div className={styles.mobileScrollHint} aria-hidden="true">
              <FiChevronDown size={18} />
              <span className={styles.mobileScrollText}>Top of portfolio</span>
            </div>
          </div>

          <div className={styles.mainGrid}>

            <div ref={leftRef} className={styles.leftCol}>
              <div className={styles.identityBlock}>
                <p className={styles.greetLine}>
                  <span className={styles.greetDot} />
                  {getGreeting()}
                </p>
                <p className={styles.roleLabel}>{profile.roles.short}</p>
                <h2 className={styles.nameHeading}>
                  {profile.name.first}
                  <br />
                  <span className={styles.nameGhost}>{profile.name.last}</span>
                </h2>
              </div>

              <div className={styles.footerInfo}>
                <p className={styles.footerDescription}>{profile.description}</p>
                <div className={styles.footerLinks}>
                  {profile.socials.slice(0, 4).map((s, i) => (
                    <span key={s.label} className={styles.footerLinkWrap}>
                      {i > 0 && <span className={styles.footerPipe}>|</span>}
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.footerLink}
                      >
                        {SOCIAL_ICONS[s.label] && (
                          <span className={styles.socialIcon}>{SOCIAL_ICONS[s.label]}</span>
                        )}
                        {s.label}
                      </a>
                    </span>
                  ))}
                </div>
                <a href={`mailto:${profile.email}`} className={styles.footerMail}>
                  <FaEnvelope size={12} aria-hidden="true" />
                  {profile.email}
                </a>
              </div>
            </div>

            <div className={styles.centerSpace} />

            <div ref={rightRef} className={styles.rightCol}>
              <div className={styles.ctaBlock}>
                <p className={styles.ctaEyebrow}>{content.footer.eyebrow}</p>
                <p className={styles.ctaHeading}>
                  {content.footer.ctaLines.map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                  <span className={styles.ctaAccent}>{content.footer.ctaAccent}</span>
                </p>
                <a href={`mailto:${profile.email}`} className={styles.talkBtn}>
                  Let&apos;s talk <FiArrowUpRight size={13} aria-hidden="true" />
                </a>
              </div>
            </div>

          </div>

          <div ref={bigNameRef} className={styles.signatureWrap}>
            <span className={styles.signatureText}>{profile.name.full.toUpperCase()}</span>
          </div>

          <footer ref={bottomBarRef} className={styles.bottomBar}>
            <div className={styles.bottomLeft}>
              <div className={styles.monogram}>
                <span className={styles.monoLetters}>YM</span>
                <span className={styles.monoDot} />
              </div>
              <span className={styles.leftDivider} />
              <div className={styles.copyBlock}>
                <p className={styles.copy}>&copy; {year} {profile.name.full.toUpperCase()}</p>
                <p className={styles.copyAll}>ALL RIGHTS RESERVED</p>
              </div>
            </div>
            <div className={styles.bottomRight}>
              <span className={styles.builtWith}>
                DESIGNED &amp; DEVELOPED
                <br />
                WITH PRECISION.
              </span>
              <span className={styles.barDivider} />
              <span className={styles.sunIcon}>✺</span>
            </div>
          </footer>
        </div>

      </div>
    </div>
  )
}
