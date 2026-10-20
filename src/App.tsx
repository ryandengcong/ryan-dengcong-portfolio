import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUp, ArrowUpRight, Box, Check,
  CodeXml, Database, GitBranch, LayoutTemplate, Mail,
  Menu, Palette, X,
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
  code: CodeXml, palette: Palette, box: Box, database: Database, git: GitBranch, layout: LayoutTemplate,
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
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
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} aria-current={active === id ? 'location' : undefined}>{label}<span /></a>
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
  useEffect(() => {
    if (!project) return
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    element?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { element?.close(); document.body.style.overflow = previousOverflow }
  }, [project])

  return (
    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title" onClose={onClose}
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
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      {project && <div className="dialog-inner">
        <button className="dialog-close icon-button" onClick={onClose} aria-label="Close project details" autoFocus><X size={21} /></button>
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
            <p>A project, an idea, or just a conversation.<br />Let’s make something worth building.</p>
          </div>
          <a href={profile.email ? `mailto:${profile.email}` : profile.github} className="contact-orb" aria-label={profile.email ? 'Send Ryan an email' : 'Visit Ryan on GitHub'} {...(!profile.email ? { target: '_blank', rel: 'noreferrer' } : {})}>
            <ArrowUpRight strokeWidth={1.2} />
          </a>
        </Reveal>
        <Reveal className="contact-bottom">
          <div className="email-block">
            <span className="eyebrow">SAY HELLO</span>
            {profile.email ? <div className="email-row">
              <a href={`mailto:${profile.email}`} className="email-link">{profile.email}</a>
              <button className="icon-button" onClick={copyEmail} aria-label="Copy email address">{copied ? <Check size={17} /> : <Mail size={17} />}</button>
              <span className="copy-status" role="status">{copied ? 'Copied' : copyError ? 'Please select and copy the email.' : ''}</span>
            </div> : <div className="email-placeholder">Email coming soon <span>Contact placeholder</span></div>}
          </div>
          <div className="social-links">
            <a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={15} /></a>
            {profile.linkedin ? <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={15} /></a> : <span className="social-placeholder" title="LinkedIn profile has not been provided"><Linkedin size={17} /> LinkedIn <span>Coming soon</span></span>}
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
                <div className="hero-eyebrow"><span className="status-dot" /> CRAFTING THE WEB, WITH PURPOSE</div>
                <h1 id="hero-heading">Ryan M.<br />Dengcong<span className="title-dot">.</span></h1>
                <p className="hero-role">{profile.role}</p>
                <p className="hero-description">Thoughtful code. Meaningful experiences.<br />I build for the people on the other side of the screen.</p>
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
                <div className="about-signature">Ryan M. Dengcong<span>DEVELOPER & CURIOUS MIND</span></div>
              </Reveal>
              <Reveal className="about-copy" delay={0.08}>
                <p className="about-lead">{profile.introduction}</p>
                <p>{profile.approach}</p>
                <span className="draft-note">Introduction draft · ready to personalize</span>
                {profile.resume && <a className="text-link" href={profile.resume} target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={17} /></a>}
              </Reveal>
            </div>
            <Reveal className="principles">
              <div><span className="principle-number">01 /</span><h3>Built with intention</h3><p>Every decision starts with a purpose.</p></div>
              <div><span className="principle-number">02 /</span><h3>Clarity over complexity</h3><p>Simple experiences. Thoughtful solutions.</p></div>
              <div><span className="principle-number">03 /</span><h3>Always exploring</h3><p>A curious mindset, one iteration at a time.</p></div>
            </Reveal>
          </div>
        </section>

        <section id="skills" className="skills-section section" aria-labelledby="skills-heading">
          <div className="container">
            <SectionLabel number="02">THE TOOLKIT</SectionLabel>
            <Reveal className="section-heading-row">
              <h2 id="skills-heading">The tools behind<br /><span className="muted-heading">the ideas.</span></h2>
              <div className="section-description"><p>A modern toolkit for building on the web.<br />The right tool. A thoughtful approach.</p><span className="draft-note">Sample skill selection · ready to personalize</span></div>
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
              <div className="section-description"><p>A few possibilities, thoughtfully explored.<br />A space for the work that comes next.</p><span className="draft-note">Sample projects · illustrative concepts only</span></div>
            </Reveal>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <Reveal key={project.title} className={`project-card ${index === 0 ? 'project-featured' : ''}`} delay={index === 2 ? 0.08 : 0}>
                  <button className="project-image-button" onClick={() => setSelectedProject(project)} aria-label={`View ${project.title} project details`}>
                    <img src={`${import.meta.env.BASE_URL}${project.image}`} alt={project.imageAlt} loading="lazy" width="1200" height="800" />
                    {project.sample && <span className="sample-badge">SAMPLE PROJECT</span>}
                    <span className="project-open" aria-hidden="true"><ArrowUpRight size={22} /></span>
                  </button>
                  <div className="project-info">
                    <div className="project-category"><span>{project.category}</span><span>{project.number} /</span></div>
                    <h3><button className="project-title" onClick={() => setSelectedProject(project)}>{project.title}<ArrowUpRight size={24} strokeWidth={1.3} /></button></h3>
                    <p>{project.description}</p>
                    <div className="project-meta">
                      <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      {project.github ? <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub repository`} className="icon-button"><Github size={17} /></a> : <span className="repository-placeholder" title="Sample concept — repository link not added"><Github size={14} /> Link pending</span>}
                    </div>
                  </div>
                </Reveal>
              ))}
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
