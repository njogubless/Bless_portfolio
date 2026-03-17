import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl"
    >
      <h3 className="text-xl font-bold text-blue-400 mb-2">{project.title}</h3>
      <p className="text-slate-400 text-sm mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tech_stack.split(',').map(tech => (
          <span key={tech} className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300">
            {tech.trim()}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        <a href={project.link} target="_blank" className="text-slate-400 hover:text-white transition">
          <Github size={20} />
        </a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;