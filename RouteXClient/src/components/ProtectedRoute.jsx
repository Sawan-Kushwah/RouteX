import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import server from '../utils/backendServer'

export default function ProtectedRoute({ children, role }) {
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let mounted = true
    axios.get(`${server}/user/verify`, { withCredentials: true })
      .then((res) => {
        if (!mounted) return
        if (res.status === 200 && res.data && res.data.user) {
          if (!role || res.data.user.role === role) {
            setAllowed(true)
          } else {
            setAllowed(false)
          }
        } else {
          setAllowed(false)
        }
      })
      .catch(() => setAllowed(false))
      .finally(() => mounted && setChecking(false))

    return () => { mounted = false }
  }, [role])

  if (checking) return null
  return allowed ? children : <Navigate to="/" replace />
}
