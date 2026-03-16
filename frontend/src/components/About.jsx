import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { personalInfo } from '../data/portfolioData';
import { FiMapPin, FiMail, FiCode } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section-padding">
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
              01. About Me
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-3">
              The Person Behind the{' '}
              <span className="gradient-text">Code</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Avatar / Visual */}
            <motion.div variants={fadeUp} className="flex justify-center md:justify-start">
              <div className="relative">
                {/* Main avatar card */}
                <div className="w-72 h-80 rounded-2xl glass border border-violet-500/20 overflow-hidden relative">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-purple-900/20 to-transparent" />
                  
                  {/* Initials */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-7xl font-serif font-bold gradient-text mb-2">BN</div>
                      <div className="text-slate-400 text-sm font-medium">Full Stack Developer</div>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <FiCode className="text-violet-300" size={20} />
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-6 glass border border-violet-500/20 rounded-xl px-3 py-2 text-xs font-medium text-violet-300"
                >
                  🚀 React & Django
                </motion.div>
                <motion.div
                  animate={{ y: [4, -4, 4] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-6 glass border border-violet-500/20 rounded-xl px-3 py-2 text-xs font-medium text-violet-300"
                >
                  📍 Nairobi, Kenya
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Text content */}
            <motion.div variants={stagger} className="space-y-6">
              <motion.p variants={fadeUp} className="text-slate-300 text-lg leading-relaxed">
                I&apos;m a self-driven developer based in{' '}
                <span className="text-violet-300 font-medium">Nairobi, Kenya</span>, passionate about
                building products at the intersection of great design and robust engineering.
              </motion.p>

              <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed">
                My journey started with curiosity — taking apart websites to understand how they
                worked. Today, I specialize in building full-stack applications with{' '}
                <span className="text-violet-300">React.js</span> on the frontend and{' '}
                <span className="text-violet-300">Django</span> on the backend, always striving for
                clean, maintainable code and exceptional user experiences.
              </motion.p>

              <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed">
                When I&apos;m not coding, you&apos;ll find me exploring Nairobi&apos;s vibrant tech
                community, contributing to open source, or mentoring aspiring developers.
              </motion.p>

              {/* Info Cards */}
              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { icon: FiMapPin, label: 'Location', value: personalInfo.location },
                  { icon: FiMail, label: 'Email', value: personalInfo.email },
                ].map(({ icon: Icon, label, value }) => (
                  <motion.div
                    key={label}
                    variants={fadeUp}
                    className="flex items-center gap-3 glass rounded-xl p-4 border border-violet-500/10 hover:border-violet-500/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0">
                      <Icon className="text-violet-400" size={16} />
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs">{label}</div>
                      <div className="text-slate-200 text-sm font-medium">{value}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Download CV Button */}
              <motion.div variants={fadeUp} className="pt-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-violet-500/30 text-violet-300 text-sm font-medium hover:border-violet-400/50 hover:text-violet-200 transition-all duration-200"
                >
                  Download CV
                  <span>↓</span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
