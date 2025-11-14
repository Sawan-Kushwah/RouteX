import { useState } from 'react'
import './LoginModal.css'

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('http://localhost:3000/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || 'Login failed')
                return
            }

            // Store token/session
            if (data.token) {
                localStorage.setItem('adminToken', data.token)
            }

            console.log('Login successful:', data)
            setEmail('')
            setPassword('')
            // notify parent that login succeeded so it can redirect/show dashboard
            if (typeof onLoginSuccess === 'function') onLoginSuccess(data)
            onClose()
        } catch (err) {
            setError('Error connecting to server: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="login-modal-overlay fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            {console.log("Rendering LoginModal")}
            <div className="login-modal-container bg-white rounded-xl shadow-2xl w-11/12 max-w-md p-10 relative">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
                    onClick={onClose}
                >
                    ✕
                </button>

                <div className="w-full">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Admin Login</h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-sans transition-all focus:outline-none focus:border-red-600 focus:bg-white focus:shadow-lg focus:shadow-red-100 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 text-black"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Password
                            </label>
                               <div className="relative">
                                   <input
                                       type={showPassword ? 'text' : 'password'}
                                       id="password"
                                       className="px-4 py-3 border-2 text-black border-gray-300 rounded-lg text-sm font-sans transition-all focus:outline-none focus:border-red-600 focus:bg-white focus:shadow-lg focus:shadow-red-100 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 pr-12 w-full"
                                       placeholder="Enter your password"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                       required
                                       disabled={loading}
                                   />
                                   <button
                                       type="button"
                                       aria-label={showPassword ? 'Hide password' : 'Show password'}
                                       aria-pressed={showPassword}
                                       onClick={() => setShowPassword((s) => !s)}
                                       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-md p-1"
                                       tabIndex={0}
                                   >
                                       {showPassword ? (
                                           // eye-off icon
                                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-4-9-4a15.7 15.7 0 0 1 3.09-3.68M6.1 6.1A9.97 9.97 0 0 1 12 5c5 0 9 4 9 4a15.7 15.7 0 0 1-2.43 2.57M3 3l18 18" />
                                           </svg>
                                       ) : (
                                           // eye icon
                                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                           </svg>
                                       )}
                                   </button>
                               </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-3 px-6 py-3 bg-linear-to-r from-red-600 to-red-800 text-white font-bold rounded-lg uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginModal
