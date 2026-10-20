// Edit this file to personalize the portfolio. null means "not provided".
// Sample projects and draft skill selections stay labeled until you replace them.
export const profile = {
  name: 'Ryan M. Dengcong',
  role: 'Web Developer / Programmer',
  email: null as string | null,
  github: 'https://github.com/ryandengcong',
  linkedin: null as string | null,
  resume: null as string | null,
  introduction:
    'I’m Ryan, a web developer and programmer. I enjoy turning ideas into thoughtful digital experiences — bringing structure to the complex and care to the smallest details.',
  approach:
    'My approach is simple: understand the problem, build with purpose, and keep improving. I’m drawn to the space where clean code meets considered design.',
}

export const toolkit = [
  { icon: 'code', title: 'Frontend', description: 'Interfaces that feel intuitive.', tags: ['React', 'TypeScript', 'JavaScript'] },
  { icon: 'palette', title: 'Styling & UI', description: 'Details that make a difference.', tags: ['Tailwind CSS', 'HTML', 'CSS'] },
  { icon: 'box', title: 'Creative development', description: 'A little depth. A lot of possibility.', tags: ['Three.js', 'React Three Fiber', 'Motion'] },
  { icon: 'database', title: 'Backend & data', description: 'Structure behind the experience.', tags: ['Node.js', 'REST APIs', 'SQL'] },
  { icon: 'git', title: 'Tools & workflow', description: 'A thoughtful process, end to end.', tags: ['Git', 'GitHub', 'Vite'] },
  { icon: 'layout', title: 'Web fundamentals', description: 'Built to work for more people.', tags: ['Responsive UI', 'Accessibility', 'Performance'] },
]

export type Project = {
  number: string
  title: string
  category: string
  description: string
  image: string
  imageAlt: string
  tags: string[]
  sample: boolean
  github: string | null
  live: string | null
  details: string
}

export const projects: Project[] = [
  {
    number: '01',
    title: 'Forma',
    category: 'WORKSPACE / WEB APPLICATION',
    description: 'A calmer place to organize projects, bring a team together, and keep meaningful work moving.',
    image: 'images/forma.svg',
    imageAlt: 'Forma concept: a light project workspace with a sidebar, progress overview, and task cards on a blue background.',
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
    sample: true,
    github: null,
    live: null,
    details: 'An illustrative workspace concept exploring clear navigation, project organization, and focused task management. The image is a custom interface illustration, not a screenshot of a completed application. Replace this sample with your own project, implementation details, and repository link.',
  },
  {
    number: '02',
    title: 'Aesop Studio',
    category: 'CREATIVE / DIGITAL EXPERIENCE',
    description: 'An editorial website concept that gives thoughtful architecture the space it deserves.',
    image: 'images/aesop.svg',
    imageAlt: 'Aesop Studio concept: an architectural editorial layout featuring a sculptural house illustration and warm neutral typography.',
    tags: ['React', 'Motion', 'Responsive Design'],
    sample: true,
    github: null,
    live: null,
    details: 'An illustrative architecture studio concept exploring editorial typography, generous space, and a responsive visual hierarchy. This is sample portfolio content, not commissioned work or an affiliation with an existing studio. Add your own creative project here.',
  },
  {
    number: '03',
    title: 'Metric',
    category: 'DATA / ANALYTICS DASHBOARD',
    description: 'A focused analytics concept that makes complex information feel clear and approachable.',
    image: 'images/metric.svg',
    imageAlt: 'Metric concept: a dark analytics dashboard with blue line charts, summary cards, and an activity table.',
    tags: ['TypeScript', 'React', 'Data Visualization'],
    sample: true,
    github: null,
    live: null,
    details: 'An illustrative analytics dashboard concept with fictional chart data and summary metrics. No real product, customers, or results are claimed. Replace this sample with a real data project and describe the problem, your role, and the outcome.',
  },
]
