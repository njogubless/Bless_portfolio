import { Routes, Route } from 'react-router-dom'
import Background from './components/Background'
import Navbar     from './components/Navbar'
import Footer     from './components/Footer'
import Home       from './pages/Home'
import About      from './pages/About'
import Work       from './pages/Work'
import Contact    from './pages/Contact'
import Blog       from './pages/Blog'
import BlogPost   from './pages/BlogPost'

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Background />
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/"           element={<Home />}     />
          <Route path="/about"      element={<About />}    />
          <Route path="/work"       element={<Work />}     />
          <Route path="/contact"    element={<Contact />}  />
          <Route path="/blog"       element={<Blog />}     />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App