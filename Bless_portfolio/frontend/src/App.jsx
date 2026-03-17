import React, { useState } from 'react'
import Background from './components/Background'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'

function App() {
  // 1. Create the state to hold the selected skill
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      <Background />
      <Navbar />
      <Hero />
      {/* 2. Pass the state and the setter function to Skills */}
      <Skills activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      {/* 3. Pass the filter value to Projects */}
      <Projects activeFilter={activeFilter} />
    </div>
  )
}

export default App