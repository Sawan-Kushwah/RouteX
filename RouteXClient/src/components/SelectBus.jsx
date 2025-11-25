import React, { useEffect, useRef, useState } from 'react'
import socket from '../utils/socket'
import axios from 'axios'
import server from '../utils/backendServer'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../utils/useSearch'
import formatUpdateTime from '../utils/formatUpdateTime'

function SelectBus() {
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [transmitting, setTransmitting] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [error, setError] = useState(null)
  const [expandedStops, setExpandedStops] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const socketIdRef = useRef(socket.id)
  const watchIdRef = useRef(null)

  // Fetch routes from server on mount
  useEffect(() => {
    fetchRoutes()
    console.log('fetching routes');
  }, [])

  const fetchRoutes = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${server}/routes/getAllAssignedRoutes`)
      if (response.status === 200) {
        setRoutes(response.data.routes)
        setError(response.message)
      }
    } catch (err) {
      console.error('Error fetching routes:', err)
      setError('Failed to fetch routes from server')
    } finally {
      setLoading(false)
    }
  }

  const startTransmission = (route) => {
    setSelectedRoute(route)
    setTransmitting(true)
    setError(null)

    // Get and watch location
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ lat: latitude, lng: longitude })
          console.log('Current location:', { lat: latitude, lng: longitude, time: formatUpdateTime(Date.now()) })

          // Transmit location via socket
          socket.emit('busUpdate', {
            busId: route.bus._id,
            busNo: route.bus.busNo,
            routeNo: route.routeNo,
            lat: latitude,
            lng: longitude,
            speed: position.coords.speed || 0,
            timestamp: position.timestamp
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
          setError('Unable to access your location. Please enable location services.')
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 1000 }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }

  const stopTransmission = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setTransmitting(false)
    setSelectedRoute(null)
    setCurrentLocation(null)
  }

  const handleLogout = async () => {
    stopTransmission()
    await axios.get(`${server}/user/logout`, { withCredentials: true })
    navigate('/')
  }

  // Filter routes: exclude busNo === -1 and apply search
  const { filteredItems: filteredRoutes } = useSearch(searchQuery, routes, ['busNo', 'routeNo', 'stops'])

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-800 shadow-lg border-b border-purple-500">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            Route<span className="text-red-600">X</span> Drivers
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="container mx-auto px-6 py-10">
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 text-red-100 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {!transmitting ? (
          <>
            {/* Available Routes Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-white">Select your bus number</h2>
                {loading && <span className="text-gray-400 text-sm">(Loading...)</span>}
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by Bus Number or Route Number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400">Fetching routes from server...</p>
                  </div>
                </div>
              ) : routes.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                  <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400">No routes available</p>
                </div>
              ) : filteredRoutes.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                  <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400">No routes match your search</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRoutes.map((route, index) => (
                    <div
                      key={route._id || index}
                      onClick={() => startTransmission(route)}
                      className="group bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                    >
                      {/* Route Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">
                            Bus Number #{route.bus.busNo}
                          </h3>
                          <p className="text-purple-400 font-mono text-sm font-bold">Route #{route.routeNo}</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                          </svg>
                        </div>
                      </div>

                      {/* Stops */}
                      {route.stops && route.stops.length > 0 && (
                        <div className="mb-4">
                          <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Stops</p>
                          <div className="flex flex-wrap gap-2">
                            {expandedStops === (route._id || index) ? (
                              <>
                                {(Array.isArray(route.stops[0]) ? route.stops[0] : route.stops).map((stop, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded">
                                    {typeof stop === 'string' ? stop : stop.name || 'Stop'}
                                  </span>
                                ))}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setExpandedStops(null)
                                  }}
                                  className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors cursor-pointer"
                                >
                                  Show Less
                                </button>
                              </>
                            ) : (
                              <>
                                {(Array.isArray(route.stops[0]) ? route.stops[0] : route.stops).slice(0, 3).map((stop, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded">
                                    {typeof stop === 'string' ? stop : stop.name || 'Stop'}
                                  </span>
                                ))}
                                {(Array.isArray(route.stops[0]) ? route.stops[0] : route.stops).length > 3 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setExpandedStops(route._id || index)
                                    }}
                                    className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors cursor-pointer"
                                  >
                                    +{(Array.isArray(route.stops[0]) ? route.stops[0] : route.stops).length - 3} more
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Transmission Active Screen */
          <div className="max-w-2xl mx-auto">
            <div className="bg-linear-to-br from-purple-900 to-gray-900 border-2 border-purple-500 rounded-lg p-8 shadow-2xl">
              {/* Status Indicator */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold text-white">Live Transmission Active</h2>
              </div>

              {/* Route Info */}
              <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Route Number</p>
                    <p className="text-white font-bold text-lg">{selectedRoute?.routeNo}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Bus Number</p>
                    <p className="text-white font-bold text-lg">{selectedRoute.bus?.busNo}</p>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-4">Current Location</h3>
                {currentLocation ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Latitude</p>
                      <p className="text-green-400 font-mono text-sm">{currentLocation.lat.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Longitude</p>
                      <p className="text-green-400 font-mono text-sm">{currentLocation.lng.toFixed(6)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-yellow-400">Waiting for location...</p>
                )}
              </div>

              {/* Connection Info */}
              <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Socket ID:</span> <span className="font-mono text-sm">{socketIdRef.current?.substring(0, 8)}...</span>
                  </p>
                </div>
                <p className="text-gray-400 text-sm mt-3">Your real-time location is being transmitted to the server.</p>
              </div>

              {/* Stop Transmission Button */}
              <button
                onClick={stopTransmission}
                className="w-full px-4 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-200 cursor-pointer"
              >
                Stop Transmission
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SelectBus
