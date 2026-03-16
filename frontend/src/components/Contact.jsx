import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiSend, FiMail, FiMapPin, FiGithub, FiLinkedin } from 'react-icons/fi';
import { personalInfo } from '../data/portfolioData';
import axios from 'axios';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const inputClass =
  'w-full bg-white/5 border border-violet-500/20 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-500/30 transition-all duration-200';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post('/api/contact/', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section-padding">
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
              05. Contact
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-3">
              Let&apos;s <span className="gradient-text">Work Together</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Have a project in mind or just want to chat? I&apos;d love to hear from you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Left: Contact Info */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div>
                <h3 className="text-white font-semibold text-xl mb-2 font-serif">
                  Get in touch
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  I&apos;m currently available for freelance work and full-time opportunities.
                  Whether you have a question or want to start a project, my inbox is always open.
                </p>
              </div>

              {/* Contact details */}
              <div className="space-y-4">
                {[
                  { icon: FiMail, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
                  { icon: FiMapPin, label: 'Location', value: personalInfo.location, href: '#' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:bg-violet-600/30 transition-colors">
                      <Icon className="text-violet-400" size={17} />
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs">{label}</div>
                      <div className="text-slate-200 text-sm font-medium group-hover:text-violet-300 transition-colors">
                        {value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <p className="text-slate-500 text-sm mb-4">Find me on</p>
                <div className="flex gap-3">
                  {[
                    { icon: FiGithub, href: personalInfo.github, label: 'GitHub' },
                    { icon: FiLinkedin, href: personalInfo.linkedin, label: 'LinkedIn' },
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
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div variants={fadeUp}>
              <form
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-6 border border-violet-500/15 space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1.5">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    required
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Status messages */}
                {status === 'success' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-400 text-sm text-center"
                  >
                    ✓ Message sent successfully! I&apos;ll get back to you soon.
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm text-center"
                  >
                    ✗ Something went wrong. Please try again or email me directly.
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold text-sm hover:from-violet-500 hover:to-purple-600 transition-all duration-200 glow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
