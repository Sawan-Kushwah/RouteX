import { lazy, Suspense, useEffect, useState } from 'react'
import { useSearch } from '../utils/useSearch'
import axios from 'axios'
import server from '../utils/backendServer'
import { useNavigate } from 'react-router-dom'
import adminProfile from '../assets/adminProfile.png'

import RouteForm from './RouteForm'
import BusForm from './BusForm'
import DriverForm from './DriverForm'
import DashboardSkeleton from './DashboardSkeleton'

const StagesItem = lazy(() => import('./StagesItem'))
const BusDashboard = lazy(() => import('./BusDashboard'))
const RoutesDashboard = lazy(() => import('./RoutesDashboard'))
const DriverDashboard = lazy(() => import('./DriverDashboard'))



export default function AdminDashboard() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [showBusDashboard, setShowBusDashboard] = useState(false)
  const [showDriverDashboard, setShowDriverDashboard] = useState(false)
  const [showRouteDashboard, setShowRouteDashboard] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showRouteForm, setShowRouteForm] = useState(false)
  const [showBusForm, setShowBusForm] = useState(false);
  const [inactiveBus, setInactiveBus] = useState([]);
  const [activeBusCount, setActiveBusCount] = useState(0);
  const [inactiveBusCount, setInactiveBusCount] = useState(0);
  const [showDriverForm, setShowDriverForm] = useState(false)

  const [driverDataChanged, setDriverDataChanged] = useState(false)
  const [busDataChanged, setBusDataChanged] = useState(false);
  const [routesDataChanged, setRoutesDataChanged] = useState(true);
  const [routeHaveBus, setRouteHaveBus] = useState();

  const [buses, setBuses] = useState([])
  const [drivers, setDrivers] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)


  async function fetchRoutes() {
    console.log("fetching route")
    try {
      setLoading(true);
      const response = await axios.get(`${server}/routes/getAllRoutes`);
      setRoutes(response.data.routes || []);
      setInactiveBus(response.data.inactiveBuses || []);
      setRouteHaveBus(response.data.routeHaveBus || 0);
      setRoutesDataChanged(false);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  }


  async function fetchBuses() {
    console.log("fetching bus")
    try {
      setLoading(true);
      const response = await axios.get(`${server}/bus/getAllBuses`);
      setBuses(response.data.buses || []);
      setBusDataChanged(false);
      setActiveBusCount(response.data.activeBusCount);
      setInactiveBusCount(response.data.inactiveBusCount);
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false)
    }
  }


  async function fetchDrivers() {
    console.log('fetching driver')
    try {
      setLoading(true);
      const response = await axios.get(`${server}/driver/getAllDrivers`)
      setDrivers(response.data.drivers || [])
      setDriverDataChanged(false);
    } catch (error) {
      console.error('Error fetching drivers:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleManageRoutes = () => {
    setShowRouteDashboard(true);
    setShowBusDashboard(false);
    setShowDriverDashboard(false);
    setIsSideMenuOpen(false);
    if (routes.length === 0 || routesDataChanged) {
      fetchRoutes();
      setRoutesDataChanged(false);
    }
  }

  const handleMangeBus = () => {
    setShowBusDashboard(true);
    setShowDriverDashboard(false);
    setShowRouteDashboard(false);
    setIsSideMenuOpen(false);
    if (buses.length === 0 || busDataChanged) {
      fetchBuses();
      setBusDataChanged(false)
    }
  }


  const handleManageDrivers = () => {
    setShowDriverDashboard(true);
    setShowBusDashboard(false);
    setShowRouteDashboard(false);
    setIsSideMenuOpen(false);
    if (drivers.length === 0 || driverDataChanged) {
      fetchDrivers()
      setDriverDataChanged(false)
    }
  }


  if (busDataChanged) {
    fetchBuses();
    setBusDataChanged(false);
  }

  if (driverDataChanged) {
    fetchDrivers();
    setDriverDataChanged(false);
  }

  if (routesDataChanged) {
    fetchRoutes();
    setRoutesDataChanged(false);
  }



  // Use the reusable search hook
  const { filteredItems: filteredRoutes } = useSearch(
    searchQuery,
    routes,
    ['routeNo', 'busNo', 'stops']
  )

  const { filteredItems: filteredBuses } = useSearch(
    searchQuery,
    buses,
    ['status', 'busNo', 'numberPlate']
  )

  const { filteredItems: filteredDrivers } = useSearch(
    searchQuery,
    drivers,
    ['firstName', 'lastName', 'email']
  )


  const handleLogout = async () => {
    await axios.get(`${server}/user/logout`, { withCredentials: true });
    navigate('/')
  }

  return (
    <div className={"flex flex-col md:flex-row min-h-screen bg-gray-50 "
      + (dark ? 'theme-dark dark:bg-gray-900' : '')
      + (isSideMenuOpen ? ' overflow-hidden' : '')}>

      <aside className={
        `z-40 fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 transform 
   ${isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
   transition-transform duration-300 ease-in-out 
   md:relative md:translate-x-0 md:block md:z-20 overflow-y-auto`
      }>


        <div className="py-4 text-gray-500 dark:text-gray-400">
          <div className='flex justify-between items-center'>

            <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">Route<span className='text-red-600'>X</span></a>
            <button onClick={() => setIsSideMenuOpen(false)} className="text-gray-200 hover:text-gray-700 text-2xl pr-3 sm:hidden">x</button>
          </div>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <span className={`absolute ${showRouteDashboard ? '' : 'hidden'} inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg`} aria-hidden="true"></span>
              <button onClick={handleManageRoutes} className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer 
                       ${!showRouteDashboard
                  ? "text-gray-400 dark:text-gray-500"  // lighter when true
                  : "text-gray-800 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200"}`} href="#">
                <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4">Manage Routes</span>
              </button>
            </li>
          </ul>
          <ul>

            <li className="relative px-6 py-3">
              <span className={`absolute ${showBusDashboard ? '' : 'hidden'} inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg`} aria-hidden="true"></span>
              <button onClick={handleMangeBus} className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer 
    ${!showBusDashboard
                  ? "text-gray-400 dark:text-gray-500"  // lighter when true
                  : "text-gray-800 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200"}`}>
                <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <span className="ml-4">Manage Buses</span>
              </button>
            </li>

            <li className="relative px-6 py-3">
              <span className={`absolute ${showDriverDashboard ? '' : 'hidden'} inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg`} aria-hidden="true"></span>
              <button onClick={handleManageDrivers} className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer 
    ${!showDriverDashboard
                  ? "text-gray-400 dark:text-gray-500"  // lighter when true
                  : "text-gray-800 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200"}`}>
                <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646zM9 9H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4m-6 0h6"></path>
                </svg>
                <span className="ml-4">Manage Drivers</span>
              </button>
            </li>
            {/* other sidebar items omitted for brevity, kept in original project if needed */}
          </ul>
          <div className="px-6 my-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold 
             text-white bg-red-600 rounded-lg shadow-md 
             hover:bg-red-700 active:bg-red-800 
             transition-all duration-200 cursor-pointer 
             hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Logout
              <span className="ml-2 text-lg font-bold">⮞</span>
            </button>
          </div>
        </div>
      </aside>

      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 opacity-40"
          onClick={() => setIsSideMenuOpen(false)}
        ></div>
      )}

      <div className="flex flex-col flex-1 w-full">
        <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800 w-full">
          <div className="container flex items-center justify-between h-full sm:px-6 px-3 mx-auto text-purple-600 dark:text-purple-300">
            <button className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple" onClick={() => setIsSideMenuOpen(!isSideMenuOpen)} aria-label="Menu">
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            </button>

            <div className="flex justify-center flex-1 lg:mr-32">
              <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
                <div className="absolute inset-y-0 flex items-center pl-2">
                  <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 p-2.5 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
                  type="text"
                  placeholder="Search clients, roles, status..."
                  aria-label="Search"
                />
              </div>
            </div>

            <ul className="flex items-center shrink-0 space-x-6">
              <li className="flex">
                <button className="rounded-md focus:outline-none focus:shadow-outline-purple" onClick={() => setDark(!dark)} aria-label="Toggle color mode">
                  {!dark ? (
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </button>
              </li>

              {/* <li className="relative">
                <button className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple" onClick={() => setIsNotificationsMenuOpen(!isNotificationsMenuOpen)} aria-label="Notifications">
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                  </svg>
                  <span aria-hidden="true" className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"></span>
                </button>
                {isNotificationsMenuOpen && (
                  <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700">
                    <li className="flex">
                      <a className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                        <span>Messages</span>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">13</span>
                      </a>
                    </li>
                    <li className="flex">
                      <a className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                        <span>Sales</span>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">2</span>
                      </a>
                    </li>
                    <li className="flex">
                      <a className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                        <span>Alerts</span>
                      </a>
                    </li>
                  </ul>
                )}
              </li> */}

              <li className="relative">
                <button className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} aria-label="Account">
                  <img className="object-cover w-8 h-8 rounded-full" src={adminProfile} alt="" aria-hidden="true" />
                </button>
                {isProfileMenuOpen && (
                  <>
                    <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700">
                      <li className="flex"><a className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">Sawan</a></li>
                      <li className="flex">
                        <button className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md text-red-500 hover:bg-gray-100 hover:text-red-800 dark:hover:bg-gray-800 dark:hover:text-red-200" href="#" onClick={handleLogout}>Log out</button>
                      </li>
                    </ul>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileMenuOpen(false)}
                    ></div>
                  </>
                )}
              </li>
            </ul>

          </div>
        </header>




        <main className="h-full overflow-y-auto bg-gray-900 py-4 px-2 sm:px-6">

          <div className="container sm:px-6 px-0 mx-auto grid">
            <h2 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Manage {showBusDashboard ? 'Buses' : showDriverDashboard ? 'Driver' : 'Routes'}</h2>

            <button
              onClick={
                showBusDashboard
                  ? () => setShowBusForm(true)
                  : showDriverDashboard
                    ? () => setShowDriverForm(true)
                    : () => setShowRouteForm(true)
              }
              className="flex items-center justify-between p-2 sm:p-4 px-3 mb-8 text-sm sm:text-base font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple cursor-pointer w-full sm:w-auto">
              <div className="flex items-center"> <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> <span>Add New {showBusDashboard ? 'Bus' : showDriverDashboard ? 'Driver' : 'Route'}</span> </div>

              {/* Plus icon – stays big on all screens */}
              <span className="text-lg sm:text-xl font-bold">+</span>
            </button>


            {showRouteForm && (
              <RouteForm
                onClose={() => setShowRouteForm(false)}
                setRoutesDataChanged={setRoutesDataChanged}
                availableBuses={inactiveBus}
                setBusDataChanged={setBusDataChanged}
              />
            )}
            {showBusForm && (
              <BusForm
                onClose={() => setShowBusForm(false)}
                setBusDataChanged={setBusDataChanged}
                setRoutesDataChanged={setRoutesDataChanged}
              />
            )}
            {showDriverForm && (
              <DriverForm
                onClose={() => setShowDriverForm(false)}
                setDriverDataChanged={setDriverDataChanged}
              />
            )}

            {loading && <DashboardSkeleton />}
            {
              showBusDashboard && (
                <>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <StagesItem
                      items={[
                        { heading: "Total Buses", value: buses.length, icon: "users", color: "orange" },
                        { heading: "Buses Active on Route", value: activeBusCount, icon: "wallet", color: "green" },
                        { heading: "Buses Inactive on Route", value: inactiveBusCount, icon: "cart", color: "blue" },
                        { heading: "Maintenance", value: buses.length - (activeBusCount + inactiveBusCount), icon: "chat", color: "teal" },
                      ]}
                    />
                  </Suspense>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <BusDashboard filteredBuses={filteredBuses} setBusDataChanged={setBusDataChanged} setRoutesDataChanged={setRoutesDataChanged} />
                  </Suspense>
                </>
              )
            }
            {
              showDriverDashboard && (
                <>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <StagesItem
                      items={[
                        { heading: "Total Driver", value: drivers.length, icon: "users", color: "orange" },
                        { heading: "Active Driver", value: 0, icon: "wallet", color: "green" },
                        { heading: "Inactive Driver", value: 0, icon: "cart", color: "blue" },
                        { heading: "Maintenance", value: 0, icon: "chat", color: "teal" },
                      ]}
                    />
                  </Suspense>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <DriverDashboard filteredDrivers={filteredDrivers} setDriverDataChanged={setDriverDataChanged} />
                  </Suspense>
                </>
              )
            }
            {
              showRouteDashboard && (
                <>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <StagesItem
                      items={[
                        { heading: "Total Routes", value: routes.length, icon: "users", color: "orange" },
                        { heading: "Routes have bus", value: routeHaveBus, icon: "wallet", color: "green" },
                        { heading: "Routes doesn't have Buses", value: routes.length - routeHaveBus, icon: "cart", color: "blue" },
                        { heading: "Total Available Buses", value: 0, icon: "chat", color: "teal" },
                      ]}
                    />
                  </Suspense>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <RoutesDashboard
                      filteredRoutes={filteredRoutes}
                      busData={buses}
                      availableBuses={inactiveBus}
                      setRoutesDataChanged={setRoutesDataChanged}
                      setBusDataChanged={setBusDataChanged}
                    />
                  </Suspense>
                </>
              )
            }

          </div>
        </main>

      </div>
    </div>
  )
}
