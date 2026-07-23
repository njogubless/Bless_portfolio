// Single source of truth for site-wide identity/contact info.
// Previously this was duplicated by hand across Hero.jsx, Footer.jsx,
// About.jsx and index.html — editing an email or handle meant hunting
// through four files. Now it's one object, imported everywhere.

const profile = {
  name: 'Paul Njogu',
  role: 'Flutter & Python Developer',
  tagline: 'Building mobile apps, REST APIs & cloud infrastructure that ships.',
  location: 'Nairobi, Kenya',
  locationShort: 'Nairobi / Remote',
  available: true,
  email: 'njogupaul994@gmail.com',
  resumeUrl: 'https://drive.google.com/file/d/1KjQzatlHPCOa0ZNacwFtbJ06ZwF5XIzx/view?usp=sharing',
  socials: [
    { label: 'GitHub', handle: '@njogubless', url: 'https://github.com/njogubless' },
    { label: 'LinkedIn', handle: 'paul-njogu', url: 'https://www.linkedin.com/in/paul-njogu-02b413214/' },
    { label: 'Twitter / X', handle: '@njogubless1', url: 'https://x.com/njogubless1' },
    { label: 'WhatsApp', handle: '+254 746 179 799', url: 'https://wa.me/254746179799' },
    { label: 'Email', handle: 'njogupaul994@gmail.com', url: 'mailto:njogupaul994@gmail.com' },
  ],
  techStack: ['Flutter', 'Python', 'Django', 'Docker', 'AWS', 'React'],
}

export default profile
