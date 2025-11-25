import { MapContainer, Marker, Popup, TileLayer, useMap , } from 'react-leaflet'
import Control from "react-leaflet-custom-control";

import { Icon } from 'leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import socket from '../utils/socket'
import busIcon from '../assets/busicon.png'
import meIcon from '../assets/me.png'
import server from '../utils/backendServer'

import '../App.css'
import RouteSearch from './SearchBar';


function ChangeView({ lat, lng }) {
    const map = useMap();
    map.setView([lat, lng], map.getZoom());
    return null;
}

const routesEndpoint =`${server}/routes/searchRoutes`
const requiredFildes = ['stops', 'busNo' , 'routeNo']



const MapComponent = () => {
    const [buses, setBuses] = useState([]);
    const [userPosition, setuserPosition] = useState({ lat: 0, lng: 0 });


    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server with ID:", socket.id);
        });

        socket.on("busUpdate", (data) => {
            console.log("Message from server:", data);
            setBuses(data);
        });

        return () => {
            socket.off("connect");
            socket.off("busUpdate");
        };
    }, []);


    useEffect(() => {
        let watchId;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                setuserPosition({ lat: latitude, lng: longitude });
            }, (error) => console.error(error),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 1000 });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
        return () => {
            if (navigator.geolocation && watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    const customBusIcon = new Icon({
        iconUrl: busIcon,
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -35]
    })

    const customUserLocationIcon = new Icon({
        iconUrl: meIcon,
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -35]
    })

    return (
        <div className='h-full w-full flex flex-col relative bg-gray-800'>
            {/* Map Container */}
            {/* <div className='bg-pink-300 w-100 h-100'></div> */}
            <div className='flex-1 w-full rounded-none overflow-hidden'>

                <MapContainer center={[userPosition.lat ? userPosition.lat : 0, userPosition.lng ? userPosition.lng : 0]} zoom={16} zoomControl={false}  style={{ height: '100%', width: '100%' }}>
                    <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='© OpenStreetMap contributors' />

                    <ChangeView lat={userPosition.lat} lng={userPosition.lng} />    
                    {/* <MapControls buses={buses} userPosition={userPosition} /> */}

                    <Marker position={[userPosition.lat, userPosition.lng]} icon={customUserLocationIcon}>
                        <Popup className='custom-popup'>
                            <div className='text-center'>
                                <p className='font-bold text-gray-800'>Your Location</p>
                                <p className='text-xs text-gray-600 mt-1'>{userPosition.lat.toFixed(6)}, {userPosition.lng.toFixed(6)}</p>
                            </div>
                        </Popup>
                    </Marker>
                    {buses.map(({ lat, lng, busNo, speed, timestamp }) => {
                        return (<Marker key={busNo} position={[lat, lng]} icon={customBusIcon}>
                            <Popup className='custom-popup'>
                                <div className='text-center'>
                                    <p className='font-bold text-gray-800'>Bus #{busNo}</p>
                                    <p className='text-sm text-gray-700 mt-1'>Speed: <span className='font-semibold'>{(speed * 3.6).toFixed(2)} km/h</span></p>
                                    <p className='text-xs text-gray-600 mt-1'>{new Date(timestamp).toLocaleTimeString()}</p>
                                </div>
                            </Popup>
                        </Marker>)
                    })}

                    {/* <Control position='bottomleft'>
                    <ZoomControl  />

                    </Control> */}

                    <Control position="topleft">
                        <RouteSearch url={routesEndpoint} limit={10} fields={requiredFildes} />
                    </Control>
                    <Control position="bottomright">
                        <div className="bg-gray-900/90 backdrop-blur-xl border border-purple-400/30 rounded-lg px-4 py-3 shadow-lg">
                            <p className="text-gray-400 text-[11px] font-semibold mb-2 tracking-wider">
                                LEGEND
                            </p>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <img src={meIcon} alt="Your location" className="w-5 h-5" />
                                    <span className="text-gray-300 text-xs">Your Location</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <img src={busIcon} alt="Bus" className="w-5 h-5" />
                                    <span className="text-gray-300 text-xs">Bus Location</span>
                                </div>
                            </div>
                        </div>
                    </Control>


                    <Control position='topright' >
                        <div className="bg-gray-900/90 backdrop-blur-xl border border-purple-400/30 rounded-lg px-4 py-3 shadow-lg min-w-[250px]">

                            {/* Buses Tracking */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>

                                <p className="text-gray-300 text-sm m-0">
                                    <span className="font-semibold text-white">{buses.length}</span> buses tracking
                                </p>
                            </div>

                            {/* User Location */}
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>

                                <p className="text-gray-300 text-sm m-0">
                                    Your Location:{" "}
                                    <span className="font-semibold text-white">
                                        {userPosition?.lat.toFixed(4)}, {userPosition?.lng.toFixed(4)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Control>

                </MapContainer>
            </div>
        </div>
    )
}

export default MapComponent