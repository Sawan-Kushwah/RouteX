import { useState } from 'react'
import LoginModal from './LoginModal.jsx'
import { useEffect } from 'react'
import MapComponent from "./MapComponent.jsx"
import axios from 'axios'
import server from '../utils/backendServer.js'
import { useNavigate } from 'react-router-dom'


function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate()

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${server}/user/verify`, {
        withCredentials: true,
      })

      if (response.status === 200) {
        if (response.data.user.role == 'admin') {
          navigate('/admin')
        } else {
          navigate('/location')
        }
      }
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    verifyToken();
  }, [])

  const handleLoginSuccess = () => {
    setIsLoginOpen(false)
    verifyToken()
  }



  return (
    <>
      <div className="bg-gray-900 h-screen w-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-linear-to-r from-gray-900 via-purple-900 to-gray-900 px-6 py-5 shadow-2xl border-b-2 border-purple-500 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white via-purple-200 to-red-600">
                Route<span className="text-red-600">X</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <p className="text-purple-300 text-sm font-semibold">Real-time Bus Tracking</p>
                <p className="text-gray-400 text-xs">Track buses on the map</p>
              </div>
              <button
                className="bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-red-600/50 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap cursor-pointer shadow-lg"
                onClick={() => setIsLoginOpen(true)}
              >
                Login
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative w-full overflow-hidden">
          {/* <Rou  teSearch /> */}
          {!isLoginOpen && <MapComponent />}
        </main>

        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </div>
    </>
  )
}

export default Home
