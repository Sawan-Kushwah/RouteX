import React, { useState } from 'react'
import axios from 'axios'
import server from '../utils/backendServer'
import SuccessModal from '../components/SuccessModal'
import { toast } from 'react-toastify'

export default function DriverForm({ onClose, setDriverDataChanged }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [addedDriver, setAddedDriver] = useState(null)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password || !confirmPassword) {
            toast.warning('Email and password are required')
            return
        }

        if (password !== confirmPassword) {
            toast.warning('Passwords do not match')
            return
        }

        try {
            const response = await axios.post(`${server}/driver/addDriver`, {
                email,
                password,
                firstName: firstName || 'Driver',
                lastName: lastName || ''
            })
            console.log("Driver Added", response)
            if (response.status === 200) {
                setAddedDriver(response.data.driver)
                setDriverDataChanged(true);
                setAddedDriver(null)
                // Clear form
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setFirstName('')
                setLastName('')
                onClose()
                toast.success("driver added")
                
            }
        } catch (error) {
            console.error('Error adding driver:', error)
            toast.error('Failed to add driver. Email might already exist.')
        }
    }



    return (
        <>
            <div className="fixed inset-0 bg-[#000000c9] flex items-center justify-center z-50 sm:p-4 p-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Add New Driver</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    
                                        setEmail(e.target.value)
                                    
                                    }}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="driver@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="••••••••"
                                />

                                <span
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        /* Eye Open */
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                                        </svg>
                                    ) : (
                                        /* Eye Off */
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeWidth="2" d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83M9.88 4.24A9.73 9.73 0 0112 4c5 0 8.27 4.11 9 7-.3 1.18-1.02 2.5-2.07 3.72M6.53 6.53C4.59 7.98 3.3 9.89 3 11c.73 2.89 4 7 9 7 1.2 0 2.34-.26 3.39-.74" />
                                        </svg>
                                    )}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="••••••••"
                                />

                                <span
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        /* Eye Open */
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                                        </svg>
                                    ) : (
                                        /* Eye Off */
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeWidth="2" d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83M9.88 4.24A9.73 9.73 0 0112 4c5 0 8.27 4.11 9 7-.3 1.18-1.02 2.5-2.07 3.72M6.53 6.53C4.59 7.98 3.3 9.89 3 11c.73 2.89 4 7 9 7 1.2 0 2.34-.26 3.39-.74" />
                                        </svg>
                                    )}
                                </span>
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Add Driver
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
