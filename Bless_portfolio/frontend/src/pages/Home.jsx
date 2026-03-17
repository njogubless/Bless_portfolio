import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectCard from '../components/projectCard/ProjectCard';

const Home = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Replace with your local Django URL
    axios.get('http://127.0.0.1:8000/api/projects/')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white px-8 py-20">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-24">
        <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Paul Njogu
        </h1>
        <p className="text-xl text-slate-400">
          Software Developer specialized in Flutter, Dart, and Python[cite: 6].
        </p>
      </section>

      {/* Projects Grid */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 border-l-4 border-blue-500 pl-4">Featured Work</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>
    </div>
  );
};

export default Home;