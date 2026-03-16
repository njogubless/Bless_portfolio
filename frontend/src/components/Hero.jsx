import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiArrowDown } from 'react-icons/fi';
import { personalInfo } from '../data/portfolioData';

const floatingShapes = [
  { size: 400, x: '70%', y: '10%', delay: 0 },
  { size: 250, x: '10%', y: '60%', delay: 1 },
  { size: 180, x: '85%', y: '70%', delay: 2 },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient blobs */}
      {floatingShapes.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            background:
              i === 0
                ? 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)'
                : i === 1
                ? 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(196,181,253,0.08) 0%, transparent 70%)',
            filter: 'blur(2px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-violet-300 text-sm font-medium mb-8 border border-violet-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for work
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-4"
          >
            Hi, I&apos;m{' '}
            <span className="gradient-text glow-text">{personalInfo.name.split(' ')[0]}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-slate-300">
              <span className="text-violet-400 font-medium">Full Stack Developer</span>{' '}
              <span className="text-slate-500">—</span>{' '}
              <span className="font-serif italic text-slate-400">React & Django</span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10"
          >
            {personalInfo.bio}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <a
              href="#projects"
              className="group px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold text-sm hover:from-violet-500 hover:to-purple-600 transition-all duration-200 glow flex items-center gap-2"
            >
              View My Work
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
            <a
              href="#contact"
              className="px-7 py-3.5 rounded-xl glass border border-violet-500/30 text-slate-200 font-semibold text-sm hover:border-violet-400/50 hover:text-white transition-all duration-200"
            >
              Get In Touch
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex items-center gap-5 mb-16">
            {[
              { icon: FiGithub, href: personalInfo.github, label: 'GitHub' },
              { icon: FiLinkedin, href: personalInfo.linkedin, label: 'LinkedIn' },
              { icon: FiTwitter, href: personalInfo.twitter, label: 'Twitter' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-11 h-11 rounded-xl glass border border-violet-500/20 flex items-center justify-center text-slate-400 hover:text-violet-300 hover:border-violet-400/40 transition-all duration-200 hover:-translate-y-1"
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 mb-16"
          >
            {[
              { value: '3+', label: 'Years Experience' },
              { value: '20+', label: 'Projects Built' },
              { value: '10+', label: 'Happy Clients' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text font-serif">{stat.value}</div>
                <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.a
            href="#about"
            variants={itemVariants}
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-violet-400 transition-colors"
          >
            <span className="text-xs font-medium tracking-widest uppercase">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FiArrowDown size={18} />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
