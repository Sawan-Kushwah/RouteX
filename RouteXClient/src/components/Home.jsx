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
        withCredentials: true
      })
      console.log("verifyed token ", response);

      if (response.status === 200) {
        if (response.data.user.role == 'admin') {
          navigate('/admin')
        } else {
          navigate('/location')
        }
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  useEffect(() => {
    verifyToken();
  }, [])

  const handleLoginSuccess = (data) => {
    // After login, server sets cookie; re-verify to get role and redirect
    setIsLoginOpen(false)
    verifyToken()
  }

 

  return (
    <>
      {/* <Link to="/location">Bus Driver</Link>
      <Link to="/map">Student</Link> */}
      <div className="bg-gray-900 h-screen w-screen flex flex-col">
        <header className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-4 shadow-lg border-b-2 border-red-600">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-5">

            <h1 className="text-3xl font-bold text-white">
              Welcome to <span className="text-red-600">RouteX</span>
            </h1>

            <button
              className="bg-linear-to-r from-red-600 to-red-800 text-white px-7 py-3 rounded-lg font-bold uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap cursor-pointer"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>

          </div>
        </header>

        <main className="flex-1 relative">
          {!isLoginOpen && <MapComponent />}
        </main>

        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </div>
    </>
  )
}

export default Home
