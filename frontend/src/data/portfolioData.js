export const personalInfo = {
  name: "Bless Njogu",
  title: "Full Stack Developer",
  tagline: "Crafting elegant digital experiences",
  bio: "I'm a passionate full-stack developer who loves building products that make a difference. With expertise in React, Django, and modern web technologies, I turn complex problems into intuitive, beautiful solutions.",
  location: "Nairobi, Kenya",
  email: "bless@example.com",
  github: "https://github.com/njogubless",
  linkedin: "https://linkedin.com/in/njogubless",
  twitter: "https://twitter.com/njogubless",
};

export const skills = [
  {
    category: "Frontend",
    icon: "🎨",
    items: [
      { name: "React.js", level: 90 },
      { name: "TypeScript", level: 82 },
      { name: "Tailwind CSS", level: 88 },
      { name: "Next.js", level: 78 },
      { name: "Framer Motion", level: 75 },
    ],
  },
  {
    category: "Backend",
    icon: "⚙️",
    items: [
      { name: "Django", level: 88 },
      { name: "Python", level: 85 },
      { name: "Django REST Framework", level: 85 },
      { name: "Node.js", level: 72 },
      { name: "PostgreSQL", level: 80 },
    ],
  },
  {
    category: "DevOps & Tools",
    icon: "🛠️",
    items: [
      { name: "Git & GitHub", level: 90 },
      { name: "Docker", level: 70 },
      { name: "Linux/Bash", level: 75 },
      { name: "REST APIs", level: 92 },
      { name: "CI/CD", level: 68 },
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform with React frontend and Django backend. Features real-time inventory management, payment integration, and a beautiful admin dashboard.",
    tech: ["React", "Django", "PostgreSQL", "Stripe", "Docker"],
    github: "https://github.com/njogubless/ecommerce",
    live: "#",
    color: "from-purple-600 to-indigo-600",
    featured: true,
  },
  {
    id: 2,
    title: "Task Management App",
    description:
      "A Kanban-style task management application with real-time collaboration. Built with React and Django Channels for WebSocket support.",
    tech: ["React", "Django Channels", "WebSockets", "Redux", "SQLite"],
    github: "https://github.com/njogubless/taskmanager",
    live: "#",
    color: "from-violet-600 to-purple-600",
    featured: true,
  },
  {
    id: 3,
    title: "AI Blog Generator",
    description:
      "Leveraging OpenAI's API to auto-generate blog content. Users can set topics, tone, and length while the system creates SEO-optimized articles.",
    tech: ["React", "Python", "OpenAI API", "FastAPI", "TailwindCSS"],
    github: "https://github.com/njogubless/ai-blog",
    live: "#",
    color: "from-fuchsia-600 to-violet-600",
    featured: false,
  },
  {
    id: 4,
    title: "Weather Dashboard",
    description:
      "A sleek weather dashboard aggregating data from multiple APIs, with historical data visualization using Chart.js and location-based forecasting.",
    tech: ["React", "Django", "Chart.js", "OpenWeatherAPI", "Redis"],
    github: "https://github.com/njogubless/weather",
    live: "#",
    color: "from-blue-600 to-violet-600",
    featured: false,
  },
];

export const experience = [
  {
    id: 1,
    role: "Full Stack Developer",
    company: "TechNairobi Solutions",
    period: "2023 – Present",
    description:
      "Lead development of client-facing web applications using React and Django. Architected microservices, improved API performance by 40%, and mentored junior developers.",
    highlights: [
      "Reduced page load time by 60% through code splitting and lazy loading",
      "Built a real-time notification system using Django Channels",
      "Implemented CI/CD pipelines with GitHub Actions and Docker",
    ],
  },
  {
    id: 2,
    role: "Frontend Developer",
    company: "Digital Creatives KE",
    period: "2022 – 2023",
    description:
      "Developed responsive, pixel-perfect UIs for fintech startups. Collaborated closely with design teams to implement complex animations and interactions.",
    highlights: [
      "Delivered 8+ client projects on time and within budget",
      "Introduced Tailwind CSS adoption across the team",
      "Built a component library used across 5 projects",
    ],
  },
  {
    id: 3,
    role: "Junior Developer",
    company: "Freelance",
    period: "2021 – 2022",
    description:
      "Worked with local businesses to build their online presence. Developed custom WordPress themes and migrated legacy PHP apps to modern React/Django stacks.",
    highlights: [
      "Built 15+ client websites and web apps",
      "Learned Django by rebuilding a PHP CMS from scratch",
      "Established long-term relationships with 5 recurring clients",
    ],
  },
];
