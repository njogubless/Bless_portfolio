import { FiGithub, FiLinkedin, FiTwitter, FiHeart } from 'react-icons/fi';
import { personalInfo } from '../data/portfolioData';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-violet-500/10 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-white font-bold text-xs">
              BN
            </div>
            <span className="font-serif font-semibold text-white">
              Bless<span className="gradient-text">.</span>
            </span>
          </a>

          {/* Copyright */}
          <p className="text-slate-500 text-sm text-center">
            © {year}{' '}
            <span className="text-slate-400">{personalInfo.name}</span>
            {' '}— Built with{' '}
            <FiHeart className="inline text-violet-400" size={12} />
            {' '}using React & Django
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
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
                className="w-9 h-9 rounded-lg glass border border-violet-500/20 flex items-center justify-center text-slate-500 hover:text-violet-300 hover:border-violet-400/40 transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
