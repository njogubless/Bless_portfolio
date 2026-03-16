import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experience } from '../data/portfolioData';
import { FiCheck } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

function ExperienceCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative flex gap-6"
    >
      {/* Timeline line & dot */}
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-violet-600 border-2 border-violet-400 shrink-0 mt-1 glow" />
        {index < experience.length - 1 && (
          <div className="w-px flex-1 bg-gradient-to-b from-violet-600/60 to-transparent mt-1 min-h-[80px]" />
        )}
      </div>

      {/* Card */}
      <div className="glass rounded-2xl p-6 border border-violet-500/10 hover:border-violet-500/25 transition-colors mb-8 flex-1 group">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-white font-semibold text-lg group-hover:text-violet-200 transition-colors">
              {item.role}
            </h3>
            <p className="text-violet-400 font-medium text-sm mt-0.5">{item.company}</p>
          </div>
          <span className="px-3 py-1 rounded-full glass border border-violet-500/20 text-slate-400 text-xs font-mono shrink-0">
            {item.period}
          </span>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>

        {/* Highlights */}
        <ul className="space-y-2">
          {item.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-slate-400 text-sm">
              <FiCheck className="text-violet-400 shrink-0 mt-0.5" size={14} />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="section-padding">
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
              04. Experience
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-3">
              My <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              A timeline of my professional experience and growth as a developer.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="max-w-3xl mx-auto">
            {experience.map((item, i) => (
              <ExperienceCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
