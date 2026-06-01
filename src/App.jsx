import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import About from './pages/About.jsx'
import Login from './pages/admin/Login.jsx'

export default function App() {
  return (
    <AuthProvider>
      <div className="grain min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"            element={<Home />}   />
            <Route path="/events"      element={<Events />} />
            <Route path="/about"       element={<About />}  />
            <Route path="/admin/login" element={<Login />}  />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
