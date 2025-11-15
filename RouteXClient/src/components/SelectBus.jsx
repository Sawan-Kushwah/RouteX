import React, { useEffect, useRef, useState } from 'react'
import socket from '../utils/socket'
import axios from 'axios';
import server from '../utils/backendServer';
import { useNavigate } from 'react-router-dom';


// start transmiting location 
function SelectBus() {
  const navigate = useNavigate()
  const routes = [
    { routeNo: 21, route: "some route", busNo: 'BUS-21', bus_id: "", _id: "" },
    { routeNo: 22, route: "some route", busNo: 'BUS-22', bus_id: "", _id: "" },
    { routeNo: 23, route: "some route", busNo: 'BUS-23', bus_id: "", _id: "" },
    { routeNo: 24, route: "some route", busNo: 'BUS-24', bus_id: "", _id: "" },
    { routeNo: 25, route: "some route", busNo: 'BUS-25', bus_id: "", _id: "" },
    { routeNo: 26, route: "some route", busNo: 'BUS-26', bus_id: "", _id: "" }
  ];

  const [route, setRoute] = useState("");
  const [busSelected, setBusSelected] = useState(false);
  const socketIdRef = useRef(null);


  useEffect(() => {
    // connect to socket connection
    socket.on("connect", () => {
      socketIdRef.current = socket.id;
      console.log("Connected to server with ID:", socket.id);
    });
    return () => {
      socket.off("connect");
    };
  }, [])

  const startTransmition = (rte) => {
    // get your location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(position)
        // transmit the location
        console.log("transmiting")

        socket.emit("busUpdate", { busId: rte.busNo, lat: latitude, lng: longitude, speed: position.coords.speed, timestamp: position.timestamp });
      }, (error) => console.error(error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 1000 })
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  
  const handleLogout = async () => {
    await axios.get(`${server}/user/logout`, { withCredentials: true });
    navigate('/')
  }

  return (
    <>
     <div className="px-6 my-6">
            <button onClick={handleLogout} className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red cursor-pointer">
              logout
              <span className="ml-2" aria-hidden="true">+</span>
            </button>
          </div>
      {
        (!busSelected) ?
          <div className="w-full bg-gray-700 h-screen flex-col gap-10 items-center mt-20 text-white ">
            {
              routes.map((rte, index) => (
                <div key={index} className={`border p-4 m-4 rounded ${route === rte.busNo ? 'bg-green-600' : 'bg-gray-800'} cursor-pointer`}
                  onClick={() => setRoute(rte.busNo)
                    & setBusSelected(true)
                    & startTransmition(rte)
                  }>
                  <h2 className="text-xl font-bold">Route No: {rte.routeNo}</h2>
                  <p>Bus No: {rte.busNo}</p>
                  <p>Route: {rte.route}</p>
                </div>
              ))
            }
          </div>
          :
          <div className="w-full bg-gray-700 h-screen flex-col gap-10 items-center mt-20 text-white ">
            <h1 className="text-2xl font-bold">Transmitting location for Bus: {route}</h1>
            <p>Socket ID: {socketIdRef.current}</p>
            <p>Your location is being transmitted to the server.</p>
          </div>


      }


    </>
  )
}

export default SelectBus
