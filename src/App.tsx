import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { MotionConfig, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { MotionStyle } from 'motion/react'
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUp, ArrowUpRight, Check,
  CodeXml, FileText, Mail, Menu, Server, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import HeroArt from './components/HeroArt'
import { Github, Linkedin } from './components/BrandIcons'
import { profile, projects, toolkit } from './content'
import type { Project } from './content'

const navigation = [
  { id: 'about', label: 'About' }, { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' }, { id: 'contact', label: 'Contact' },
]

const skillIcons: Record<string, LucideIcon> = {
  frontend: CodeXml, backend: Server,
}

function Reveal({ children, className = '', delay = 0, style, ...motionProps }: { children: ReactNode; className?: string; delay?: number; style?: MotionStyle; onPointerMove?: React.PointerEventHandler<HTMLDivElement>; onPointerLeave?: React.PointerEventHandler<HTMLDivElement> }) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      {...motionProps}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function ProjectCard({ project, index, onSelect }: { project: Project; index: number; onSelect: (project: Project) => void }) {
  const reduceMotion = useReducedMotion()
  const tiltX = useSpring(useMotionValue(0), { stiffness: 170, damping: 24, mass: 0.6 })
  const tiltY = useSpring(useMotionValue(0), { stiffness: 170, damping: 24, mass: 0.6 })
  const imageX = useSpring(useMotionValue('0px'), { stiffness: 140, damping: 25 })
  const imageY = useSpring(useMotionValue('0px'), { stiffness: 140, damping: 25 })

  const resetTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
    imageX.set('0px')
    imageY.set('0px')
  }
  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (reduceMotion || event.pointerType === 'touch' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width * 2 - 1
    const y = (event.clientY - bounds.top) / bounds.height * 2 - 1
    tiltX.set(-y * 2.5)
    tiltY.set(x * 2.5)
    imageX.set(`${-x * 4}px`)
    imageY.set(`${-y * 4}px`)
  }

  return (
    <Reveal key={project.title} className={`project-card ${index === 0 ? 'project-featured' : ''}`} delay={index * 0.08} onPointerMove={handlePointerMove} onPointerLeave={resetTilt}
      style={{ perspective: 1200, rotateX: tiltX, rotateY: tiltY, '--image-x': imageX, '--image-y': imageY } as MotionStyle}>
      <button className="project-image-button" onClick={() => onSelect(project)} aria-label={`View ${project.title} project details`}>
        <img src={`${import.meta.env.BASE_URL}${project.image}`} alt={project.imageAlt} loading="lazy" width="1200" height="800" />
        {project.sample && <span className="sample-badge">DEMONSTRATION · CONCEPT</span>}
        <span className="project-open" aria-hidden="true"><ArrowUpRight size={22} /></span>
      </button>
      <div className="project-info">
        <div className="project-category"><span>{project.category}</span><span>{project.number} /</span></div>
        <h3><button className="project-title" onClick={() => onSelect(project)}>{project.title}<ArrowUpRight size={24} strokeWidth={1.3} /></button></h3>
        <p>{project.description}</p>
        <div className="project-meta">
          <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          {project.github ? <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub repository`} className="icon-button"><Github size={17} /></a> : <span className="repository-placeholder" title="Sample concept — repository link not added"><Github size={14} /> Link pending</span>}
        </div>
      </div>
    </Reveal>
  )
}

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className="section-label"><span>{number}</span><span className="label-line" />{children}</div>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
    }, { rootMargin: '-15% 0px -55% 0px' })
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); menuButton.current?.focus() }
    }
    const onResize = () => { if (window.innerWidth > 760) setOpen(false) }
    document.addEventListener('keydown', onEscape)
    window.addEventListener('resize', onResize)
    return () => { document.removeEventListener('keydown', onEscape); window.removeEventListener('resize', onResize) }
  }, [open])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="wordmark" aria-label="Ryan Dengcong — home" onClick={() => setOpen(false)}>rd<span>.</span></a>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} id="main-navigation" aria-label="Main navigation">
          {navigation.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} aria-current={active === id ? 'location' : undefined}>{label}<span aria-hidden="true" /></a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-contact" href="#contact">Let’s talk <ArrowUpRight size={15} /></a>
          <button ref={menuButton} type="button" className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!project) return
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    element?.classList.remove('is-closing')
    element?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
      element?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [project])

  const closeDialog = () => {
    const element = dialog.current
    if (!project || !element?.open || element.classList.contains('is-closing')) return
    element.classList.add('is-closing')
    const finishClose = () => {
      element.close()
      element.classList.remove('is-closing')
      onClose()
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose()
    else closeTimer.current = setTimeout(finishClose, 180)
  }

  return (
    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title"
      onCancel={(event) => { event.preventDefault(); closeDialog() }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const focusable = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      onClick={(event) => { if (event.target === event.currentTarget) closeDialog() }}>
      {project && <div className="dialog-inner">
        <button className="dialog-close icon-button" onClick={closeDialog} aria-label="Close project details" autoFocus><X size={21} /></button>
        <img src={`${import.meta.env.BASE_URL}${project.image}`} alt={project.imageAlt} />
        <div className="dialog-content">
          <span className="eyebrow">{project.sample ? 'SAMPLE PROJECT · CONCEPT ONLY' : project.category}</span>
          <h2 id="project-dialog-title">{project.title}</h2>
          <p>{project.details}</p>
          <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="dialog-links">
            {project.github ? <a className="button button-secondary" href={project.github} target="_blank" rel="noreferrer">View on GitHub <Github size={17} /></a> : <span className="placeholder-note"><Github size={16} /> Repository link not added yet</span>}
            {project.live && <a className="text-link" href={project.live} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={17} /></a>}
          </div>
        </div>
      </div>}
    </dialog>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current) }, [])

  async function copyEmail() {
    if (!profile.email) return
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setCopyError(false)
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), 2500)
    } catch { setCopyError(true) }
  }

  return (
    <section className="contact-section section" id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <SectionLabel number="04">LET’S CONNECT</SectionLabel>
        <Reveal className="contact-main">
          <div>
            <h2 id="contact-heading">Have something<br />in <span className="serif-word">mind?</span></h2>
            <p>{profile.email ? 'For a project inquiry or a conversation, send me a note.' : 'For now, GitHub is the best way to reach me.'}</p>
          </div>
          <a href={profile.email ? `mailto:${profile.email}` : profile.github} className="contact-orb" aria-label={profile.email ? 'Send Ryan an email' : 'Visit Ryan on GitHub'} {...(!profile.email ? { target: '_blank', rel: 'noreferrer' } : {})}>
            <ArrowUpRight strokeWidth={1.2} />
          </a>
        </Reveal>
        <Reveal className="contact-bottom">
          <div className="email-block">
            {profile.email ? <><span className="eyebrow">EMAIL</span><div className="email-row">
              <a href={`mailto:${profile.email}`} className="email-link">{profile.email}</a>
              <button className="icon-button" onClick={copyEmail} aria-label="Copy email address">{copied ? <Check size={17} /> : <Mail size={17} />}</button>
              <span className="copy-status" role="status">{copied ? 'Copied' : copyError ? 'Please select and copy the email.' : ''}</span>
            </div></> : <><span className="eyebrow">CONTACT</span><p className="contact-hint">Email address not added yet.</p></>}
          </div>
          <div className="social-links">
            <a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={15} /></a>
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={15} /></a>}
            {profile.resume && <a href={profile.resume} target="_blank" rel="noreferrer"><FileText size={17} /> Résumé <ArrowUpRight size={15} /></a>}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <section className="hero section" id="home" aria-labelledby="hero-heading">
          <div className="container">
            <div className="hero-main">
              <Reveal className="hero-copy">
                <div className="hero-eyebrow">{profile.name}</div>
                <h1 id="hero-heading" aria-label="Building purposeful digital experiences.">Building purposeful<br />digital experiences<span className="title-dot">.</span></h1>
                <p className="hero-role">{profile.role}</p>
                <p className="hero-description">With a BSIT background, I focus on frontend and backend development to build functional, user-friendly web applications.</p>
                <div className="hero-actions">
                  <a href="#projects" className="button button-primary">Explore my work <ArrowUpRight size={17} /></a>
                  <a href="#about" className="hero-about-link">A little about me <ArrowRight size={16} /></a>
                </div>
              </Reveal>
              <HeroArt reducedMotion={Boolean(reducedMotion)} />
            </div>
            <div className="hero-footer">
              <a href="#about" className="scroll-link"><span className="scroll-icon"><ArrowDown size={15} /></span> SCROLL TO EXPLORE</a>
              <span className="hero-footer-note">AT THE INTERSECTION OF LOGIC & CREATIVITY</span>
              <span className="hero-index">01 <span>/</span> 05</span>
            </div>
          </div>
        </section>

        <section id="about" className="about-section section" aria-labelledby="about-heading">
          <div className="container">
            <SectionLabel number="01">A LITTLE ABOUT ME</SectionLabel>
            <div className="about-grid">
              <Reveal>
                <h2 id="about-heading">Good code.<br /><span className="muted-heading">Better experiences.</span></h2>
                <div className="about-signature">Ryan M. Dengcong<span>WEB DEVELOPER / PROGRAMMER</span></div>
              </Reveal>
              <Reveal className="about-copy" delay={0.08}>
                {profile.introduction.map((paragraph, index) => <p key={paragraph} className={index === 0 ? 'about-lead' : undefined}>{paragraph}</p>)}
                {profile.resume && <a className="text-link" href={profile.resume} target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={17} /></a>}
              </Reveal>
            </div>
            <Reveal className="profile-facts">
              <div><span>EDUCATION</span><p>{profile.education}</p></div>
              <div><span>EXPERIENCE</span><p>{profile.experienceLevel}</p></div>
              <div><span>DEVELOPMENT FOCUS</span><p>{profile.developmentFocus}</p></div>
            </Reveal>
            <Reveal className="principles">
              <div><span className="principle-number">01 /</span><h3>Built with intention</h3><p>Every decision starts with a purpose.</p></div>
              <div><span className="principle-number">02 /</span><h3>Clarity over complexity</h3><p>Simple experiences. Thoughtful solutions.</p></div>
              <div><span className="principle-number">03 /</span><h3>Always exploring</h3><p>A curious mindset, one iteration at a time.</p></div>
            </Reveal>
          </div>
        </section>

        <section id="skills" className="skills-section section" aria-labelledby="skills-heading">
          <div className="container">
            <SectionLabel number="02">TECHNICAL SKILLS</SectionLabel>
            <Reveal className="section-heading-row">
              <h2 id="skills-heading">Frontend & backend<br /><span className="muted-heading">development.</span></h2>
              <div className="section-description"><p>Programming languages I use to build web applications, grouped by their role in development.</p></div>
            </Reveal>
            <div className="skills-grid">
              {toolkit.map((skill, i) => {
                const Icon = skillIcons[skill.icon] ?? CodeXml
                return <Reveal key={skill.title} delay={(i % 3) * 0.06} className="skill-card">
                  <div className="skill-card-top"><Icon size={24} strokeWidth={1.4} /><span>0{i + 1}</span></div>
                  <h3>{skill.title}</h3><p>{skill.description}</p>
                  <div className="skill-tags">{skill.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </Reveal>
              })}
            </div>
          </div>
        </section>

        <section id="projects" className="projects-section section" aria-labelledby="projects-heading">
          <div className="container">
            <SectionLabel number="03">SELECTED CONCEPTS</SectionLabel>
            <Reveal className="section-heading-row">
              <h2 id="projects-heading">Ideas made<br /><span className="muted-heading">tangible.</span></h2>
              <div className="section-description"><p>Illustrative interface concepts, clearly labeled as demonstrations rather than shipped or client work.</p></div>
            </Reveal>
            <div className="projects-grid">
              {projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} onSelect={setSelectedProject} />)}
            </div>
            <Reveal className="projects-footer">
              <span>More ideas are always taking shape.</span>
              <a href={profile.github} target="_blank" rel="noreferrer" className="text-link">Find me on GitHub <ArrowUpRight size={17} /></a>
            </Reveal>
          </div>
        </section>

        <div className="interlude container" aria-hidden="true"><span>THINK.</span><span>BUILD.</span><span>REFINE.</span><ArrowDownRight strokeWidth={0.7} /></div>
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <a href="#home" className="wordmark" aria-label="Back to home">rd<span>.</span></a>
          <p>© {new Date().getFullYear()} Ryan M. Dengcong</p>
          <span className="footer-note">Made with intention.</span>
          <a className="back-to-top" href="#home">Back to top <ArrowUp size={15} /></a>
        </div>
      </footer>
      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </MotionConfig>
  )
}
