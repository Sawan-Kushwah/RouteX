import { lazy, Suspense, useState } from 'react'
import LoginModal from './LoginModal.jsx'
import { useEffect } from 'react'

const MapComponent = lazy(() => import("./MapComponent.jsx"));

import axios from 'axios'
import server from '../utils/backendServer.js'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import MapComponentSkeleton from './MapComponentSkeleton.jsx';



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
      console.log(error)
      return null
    }
  }

  useEffect(() => {
    verifyToken();
  })

  const handleLoginSuccess = () => {
    setIsLoginOpen(false)
    verifyToken()
  }



  return (
    <>
      <div className="bg-gray-900 h-screen w-screen flex flex-col overflow-hidden">
        <Navbar text={"login"} handleClick={() => setIsLoginOpen(true)} />
        <main className="flex-1 relative w-full overflow-hidden">

          {!isLoginOpen &&
            <Suspense fallback={<MapComponentSkeleton />}>
              <MapComponent />
            </Suspense>
          }

        </main>

        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </div>
    </>
  )
}

export default Home
