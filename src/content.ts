// Edit this file to personalize the portfolio. null means "not provided".
// Sample projects stay labeled until you replace them with real work.
export const profile = {
  name: 'Ryan M. Dengcong',
  role: 'Web Developer / Programmer',
  email: 'rdengcong@gmail.com',
  github: 'https://github.com/ryandengcong',
  linkedin: null as string | null,
  resume: null as string | null,
  education: 'Bachelor of Science in Information Technology (BSIT)',
  experienceLevel: 'Experienced developer',
  developmentFocus: 'Frontend & Backend Development',
  introduction: [
    "Hi, I'm Ryan M. Dengcong, a Web Developer and Programmer with a background in Bachelor of Science in Information Technology and experience in both frontend and backend development.",
    'I work with HTML, CSS, JavaScript, PHP, and Python to build functional, responsive, and user-friendly web applications. I enjoy turning ideas into practical digital solutions and approaching development challenges with creativity and problem-solving.',
    'My focus is on writing clean, maintainable code, improving user experiences, and continuously developing my technical skills. I value thoughtful design, reliable functionality, and creating web applications that are both effective and easy to use.',
  ],
}

export const toolkit = [
  { icon: 'frontend', title: 'Frontend Development', description: 'Structure, styling, and interactivity for the web.', tags: ['HTML', 'CSS', 'JavaScript'] },
  { icon: 'backend', title: 'Backend Development', description: 'Server-side programming and application logic.', tags: ['PHP', 'Python'] },
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
    tags: ['Workspace concept', 'Project workflows', 'Task interface'],
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
    tags: ['Editorial concept', 'Architecture', 'Visual hierarchy'],
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
    tags: ['Analytics concept', 'Fictional data', 'Dashboard interface'],
    sample: true,
    github: null,
    live: null,
    details: 'An illustrative analytics dashboard concept with fictional chart data and summary metrics. No real product, customers, or results are claimed. Replace this sample with a real data project and describe the problem, your role, and the outcome.',
  },
]
