import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects } from '../data/portfolioData';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative glass rounded-2xl overflow-hidden border border-violet-500/10 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Top gradient bar */}
      <div className={`h-1 bg-gradient-to-r ${project.color}`} />

      <div className="p-6">
        {/* Featured badge */}
        {project.featured && (
          <span className="inline-block mb-4 px-2.5 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/20 text-violet-300 text-xs font-medium">
            ⭐ Featured
          </span>
        )}

        {/* Project number */}
        <div className="text-slate-700 font-mono text-4xl font-bold absolute top-5 right-6 select-none">
          {String(index + 1).padStart(2, '0')}
        </div>

        <h3 className="text-white font-semibold text-xl mb-3 group-hover:text-violet-200 transition-colors">
          {project.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 rounded-md bg-violet-900/30 text-violet-300 text-xs font-mono border border-violet-700/20"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors duration-200"
            aria-label="GitHub"
          >
            <FiGithub size={16} />
            <span>Code</span>
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-400 hover:text-violet-300 text-sm transition-colors duration-200"
            aria-label="Live Demo"
          >
            <FiExternalLink size={16} />
            <span>Live Demo</span>
          </a>
        </div>
      </div>

      {/* Hover glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 pointer-events-none`}
        style={{ opacity: hovered ? 0.04 : 0 }}
      />
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-violet-400 text-sm font-medium tracking-widest uppercase font-mono">
              03. Projects
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-3">
              Things I&apos;ve{' '}
              <span className="gradient-text">Built</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              A selection of projects that showcase my skills and passion for development.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {/* View More */}
          <motion.div variants={fadeUp} className="text-center mt-12">
            <a
              href="https://github.com/njogubless"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass border border-violet-500/30 text-violet-300 font-medium hover:border-violet-400/50 hover:text-violet-200 transition-all duration-200 group"
            >
              <FiGithub size={18} />
              View All on GitHub
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
