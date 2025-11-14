
import './App.css'
import Home from './components/Home.jsx'

import { useState } from 'react'
import MapComponent from './components/MapComponent.jsx'
import LoginModal from './components/LoginModal.jsx'
import AdminDashboard from './adminDashboard/AdminDashboard.jsx'
import { useEffect } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TransmitonPage from './components/TransmitonPage.jsx';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'))

  useEffect(() => {
    // keep local state in sync with storage in case of manual changes
    const handleStorage = () => setAdminToken(localStorage.getItem('adminToken'))
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const handleLoginSuccess = (data) => {
    if (data && data.token) setAdminToken(data.token)
    setIsLoginOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken(null)
  }

  return (
    <BrowserRouter>
      <div className="app-root bg-[#242424]">
        <header className="app-header text-center pt-4 shadow">
          <h1 className="text-3xl font-bold">Welcome to <span className="text-red-600">RouteX</span></h1>
        </header>
        <main>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapComponent />} />
              <Route path="/location" element={<TransmitonPage />}/>

          </Routes>
        </main>
      </div>
    </BrowserRouter>

    <div className="bg-gray-900 h-screen w-screen flex flex-col">
      <header className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-4 shadow-lg border-b-2 border-red-600">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-5">
          {adminToken ? (
            <>
              <h1 className="text-3xl font-bold text-white">
                Admin <span className="text-red-600">D</span>ashboard
              </h1>
              <button onClick={handleLogout} className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition">Logout</button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white">
                Welcome to <span className="text-red-600">RouteX</span>
              </h1>

              <button
                className="bg-linear-to-r from-red-600 to-red-800 text-white px-7 py-3 rounded-lg font-bold uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                onClick={() => setIsLoginOpen(true)}
              >
                Login as Admin
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 relative">
        {adminToken ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          !isLoginOpen && <MapComponent />
        )}
      </main>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </div>

  )
}

export default App
