import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '../data/portfolioData';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function SkillBar({ name, level, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-slate-300 text-sm font-medium">{name}</span>
        <span className="text-violet-400 text-xs font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-400"
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="section-padding">
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
              02. Skills
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-3">
              My <span className="gradient-text">Tech Stack</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Tools and technologies I work with to bring ideas to life.
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {skills.map((category, catIndex) => (
              <motion.div
                key={category.category}
                variants={fadeUp}
                className="glass rounded-2xl p-6 border border-violet-500/10 hover:border-violet-500/25 transition-colors duration-300 group"
              >
                {/* Card Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-800/30 border border-violet-500/20 flex items-center justify-center text-xl">
                    {category.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg">{category.category}</h3>
                </div>

                {/* Skill Bars */}
                <div className="space-y-4">
                  {category.items.map((skill, i) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      index={catIndex * 5 + i}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Technologies */}
          <motion.div variants={fadeUp} className="mt-12 text-center">
            <p className="text-slate-500 text-sm mb-6 uppercase tracking-widest font-mono">Also familiar with</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['GraphQL', 'Celery', 'Redis', 'AWS S3', 'Nginx', 'Figma', 'Jest', 'Pytest', 'Sass'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-4 py-1.5 rounded-full glass border border-violet-500/15 text-slate-400 text-sm hover:border-violet-400/30 hover:text-violet-300 transition-all duration-200 cursor-default"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
