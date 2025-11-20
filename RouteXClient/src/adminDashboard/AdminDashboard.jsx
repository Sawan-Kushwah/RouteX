import { useEffect, useState } from 'react'
import { useSearch } from '../utils/useSearch'
import BusDashboard from './BusDashboard'
import RoutesDashboard from './RoutesDashboard'
import DriverDashboard from './DriverDashboard'
// import routesData from '../utils/routeData'
import RouteForm from './RouteForm'
import BusForm from './BusForm'
import axios from 'axios'
import server from '../utils/backendServer'
import { useNavigate } from 'react-router-dom'
import DriverForm from './DriverForm'
import StagesItem from '../components/StagesItem'



export default function AdminDashboard() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [showBusDashboard, setShowBusDashboard] = useState(false)
  const [showDriverDashboard, setShowDriverDashboard] = useState(false)
  // const [showRouteDashboard, setShowRouteDashboard] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showRouteForm, setShowRouteForm] = useState(false)
  const [showBusForm, setShowBusForm] = useState(false);
  const [assignedBus, setAssignedBus] = useState([]);
  const [unAssignedBus, setUnAssignedBus] = useState([]);
  const [assignedBusCount, setAssignedBusCount] = useState(0);
  const [unAssignedBusCount, setUnAssignedBusCount] = useState(0);
  const [showDriverForm, setShowDriverForm] = useState(false)

  const [driverDataChanged, setDriverDataChanged] = useState(false)
  const [busDataChanged, setBusDataChanged] = useState(false);
  const [routesDataChanged, setRoutesDataChanged] = useState(true);

  const [buses, setBuses] = useState([])
  const [drivers, setDrivers] = useState([])
  const [routes, setRoutes] = useState([])

  const [showRouteDashboard, setShowRouteDashboard] = useState(false);

  async function fetchRoutes() {
    console.log("fetching route")
    try {
      const response = await axios.get(`${server}/routes/getAllRoutes`);
      if (routes.length == 0) {
        setRoutes(response.data.routes);
        setShowRouteDashboard(true);
      }
      if(buses.length === 0){
        fetchBuses();
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  }




  async function fetchBuses() {
    console.log("in fetch bus")
    try {
      const response = await axios.get(`${server}/bus/getAllBuses`);
      setBuses(response.data.buses);
      console.log("Buses fetched:", response.data.buses);
      setBusDataChanged(false);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  }




  async function fetchDrivers() {
    // console.log('fetch driver')
    try {
      const response = await axios.get(`${server}/driver/getAllDrivers`)
      setDrivers(response.data.drivers || [])
      setDriverDataChanged(false);
    } catch (error) {
      console.error('Error fetching drivers:', error)
    }
  }



  // make an arr of assigned bus no from routes and unassigned bus no from buses

  useEffect(() => {
    // reset assigned and unassigned bus arrays
    console.log("Calculating assigned and unassigned buses...");
    console.log("All Buses in useEffect: ", buses);
    console.log("All Routes in useEffect: ", routes);
    setAssignedBus([]);
    if(buses.length === 0){
      fetchBuses();
      return;
    }

    buses.forEach((bus) => {
      console.log("Checking bus:", bus.busNo, "with status:", bus.status);
      if (bus.status === 'assigned') {
        setAssignedBus([bus, ...assignedBus]);
      } else if (bus.status === 'unassigned') {
        setUnAssignedBus([bus, ...unAssignedBus]);
      }
    })

    setAssignedBusCount(assignedBus.length);
    setUnAssignedBusCount(unAssignedBus.length);
  }, [buses, routes]);




  const handleManageRoutes = () => {
    setShowBusDashboard(false);
    setShowDriverDashboard(false);
    if (routes.length === 0)
      fetchRoutes();
  }

  const handleMangeBus = () => {
    setShowBusDashboard(true);
    setShowDriverDashboard(false);
    // setShowRouteDashboard(false);
    if (buses.length === 0)
      fetchBuses();
  }




  const handleManageDrivers = () => {
    setShowDriverDashboard(true);
    setShowBusDashboard(false);
    // setShowRouteDashboard(false);
    // fetch drivers when opening drivers view or when data was flagged as changed
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
    // console.log("Routes data changed, refetching routes...");
    fetchRoutes();
    setRoutesDataChanged(false);
  }


  const getUnassignedBus = async () => {
    // this function is for getting unassigned bus (whihch is not assigned to any route)
    if (buses.length === 0) {
      // if not yet fetched so fetch it
      console.log("Fetching buses for unassigned bus calculation");
      fetchBuses();
    }
    console.log("Calculating unassigned buses...");
    console.log("All Buses:", buses);
    console.log("Assigned Bus:", assignedBus);
    buses.forEach((bus) => {
      // those bus jinka bus no assigned bus array me nhi he
      if (!assignedBus.includes(bus.busNo)) {
        setUnAssignedBus([bus.busNo, ...unAssignedBus]);
      }
    }
    )
    return unAssignedBus;
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
    <div className={"flex h-screen bg-gray-50 " + (dark ? 'theme-dark dark:bg-gray-900' : '') + (isSideMenuOpen ? ' overflow-hidden' : '')}>
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block shrink-0">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">Route<span className='text-red-600'>X</span></a>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
              <button onClick={handleManageRoutes} className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer 
                       ${(showBusDashboard || showDriverDashboard)
                  ? "text-gray-400 dark:text-gray-500"  // lighter when true
                  : "text-gray-800 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200"}`} href="#">
                <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4">Manage Routes</span>
              </button>
            </li>
          </ul>
          <ul>

            <li className="relative px-6 py-3">
              <button onClick={handleMangeBus} className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer 
    ${!showBusDashboard
                  ? "text-gray-400 dark:text-gray-500"  // lighter when true
                  : "text-gray-800 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200"}`}>
                <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <span className="ml-4">Manage Buses</span>
              </button>
            </li>

            <li className="relative px-6 py-3">
              <button onClick={handleManageDrivers} className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 cursor-pointer 
    ${!showDriverDashboard
                  ? "text-gray-400 dark:text-gray-500"  // lighter when true
                  : "text-gray-800 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200"}`}>
                <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646zM9 9H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4m-6 0h6"></path>
                </svg>
                <span className="ml-4">Manage Drivers</span>
              </button>
            </li>
            {/* other sidebar items omitted for brevity, kept in original project if needed */}
          </ul>
          <div className="px-6 my-6">
            <button onClick={handleLogout} className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red cursor-pointer">
              logout
              <span className="ml-2" aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 w-full">
        <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
          <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
            <button className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple" onClick={() => setIsSideMenuOpen(!isSideMenuOpen)} aria-label="Menu">
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </button>

            <div className="flex justify-center flex-1 lg:mr-32">
              <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
                <div className="absolute inset-y-0 flex items-center pl-2">
                  <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
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
                      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
                    </svg>
                  )}
                </button>
              </li>

              <li className="relative">
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
              </li>

              <li className="relative">
                <button className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} aria-label="Account">
                  <img className="object-cover w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82" alt="" aria-hidden="true" />
                </button>
                {isProfileMenuOpen && (
                  <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700">
                    <li className="flex"><a className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">Profile</a></li>
                    <li className="flex"><a className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">Settings</a></li>
                    <li className="flex"><a className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">Log out</a></li>
                  </ul>
                )}
              </li>
            </ul>
            
          </div>
        </header>




        <main className="h-full overflow-y-auto bg-gray-900 py-6 ">

          <div className="container px-6 mx-auto grid">
            <h2 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Manage {showBusDashboard ? 'Buses' : showDriverDashboard ? 'Driver' : 'Routes'}</h2>

            <button onClick={showBusDashboard ? () => setShowBusForm(true) : showDriverDashboard ? () => setShowDriverForm(true) : () => setShowRouteForm(true)} className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple cursor-pointer">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span>Add New {showBusDashboard ? 'Bus' : showDriverDashboard ? 'Driver' : 'Route'}</span>
              </div>
              <span className="text-xl">
                +
              </span>
            </button>

            {showRouteForm && (
              <RouteForm
                onClose={() => setShowRouteForm(false)}
              // onAddRoute={() => setRoutesDataChanged(true)}
              />
            )}
            {showBusForm && (
              <BusForm
                onClose={() => setShowBusForm(false)}
                setBusDataChanged={setBusDataChanged}
              />
            )}
            {showDriverForm && (
              <DriverForm
                onClose={() => setShowDriverForm(false)}
                setDriverDataChanged={setDriverDataChanged}
              />
            )}
            {
              showBusDashboard && (
                <>
                  <StagesItem
                    items={[
                      { heading: "Total Buses", value: buses.length, icon: "users", color: "orange" },
                      { heading: "Assigned Buses", value: assignedBusCount, icon: "wallet", color: "green" },
                      { heading: "UnAssigned Buses", value: unAssignedBusCount, icon: "cart", color: "blue" },
                      { heading: "Maintenance", value: buses.length - (assignedBusCount + unAssignedBusCount), icon: "chat", color: "teal" },
                    ]}
                  />
                  <BusDashboard filteredBuses={filteredBuses} setBusDataChanged={setBusDataChanged} />
                </>
              )
            }{
              showDriverDashboard &&
              (
                <>
                  <StagesItem
                    items={[
                      { heading: "Total Driver", value: drivers.length, icon: "users", color: "orange" },
                      { heading: "Active Driver", value: assignedBus, icon: "wallet", color: "green" },
                      { heading: "Inactive Driver", value: unAssignedBus, icon: "cart", color: "blue" },
                      { heading: "Maintenance", value: 69, icon: "chat", color: "teal" },
                    ]}
                  />

                  <DriverDashboard filteredDrivers={filteredDrivers} setDriverDataChanged={setDriverDataChanged} />
                </>
              )
            }{
              showRouteDashboard &&
              (
                <>
                  <StagesItem
                    items={[
                      { heading: "Total Routes", value: buses.length, icon: "users", color: "orange" },
                      { heading: "Assigned Buses", value: assignedBusCount, icon: "wallet", color: "green" },
                      { heading: "UnAssigned Buses", value: unAssignedBusCount, icon: "cart", color: "blue" },
                      { heading: "Let's do", value: 69, icon: "chat", color: "teal" },
                    ]}
                  />
                  <RoutesDashboard
                    filteredRoutes={filteredRoutes}
                    busData={buses}
                    getUnassignedBus={getUnassignedBus}
                    setRoutesDataChanged={setRoutesDataChanged}
                  //  setRoutesDataChanged={setRoutesDataChanged} 
                  />
                </>
              )
            }
          </div>
        </main>

      </div>
    </div>
  )
}
