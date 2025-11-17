import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Icon, Control } from 'leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import socket from '../utils/socket'
import busIcon from '../assets/busicon.png'
import meIcon from '../assets/me.png'


import '../App.css'


function ChangeView({ lat, lng }) {
    const map = useMap();
    map.setView([lat, lng], map.getZoom());
    return null;
}

function MapControls({ buses, userPosition }) {
    const map = useMap();

    useEffect(() => {
        // Info Bar Control
        const InfoControl = Control.extend({
            onAdd: function (map) {
                const div = document.createElement('div');
                div.className = 'leaflet-control-info';
                div.innerHTML = `
                    <div style="background: rgba(17, 24, 39, 0.9); backdrop-filter: blur(12px); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); min-width: 250px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                            <div style="width: 10px; height: 10px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite;"></div>
                            <p style="color: #d1d5db; font-size: 14px; margin: 0;">
                                <span style="font-weight: 600; color: white;">${buses.length}</span> buses tracking
                            </p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 10px; height: 10px; background: #3b82f6; border-radius: 50%;"></div>
                            <p style="color: #d1d5db; font-size: 14px; margin: 0;">
                                Your Location: <span style="font-weight: 600; color: white;">${userPosition.lat.toFixed(4)}, ${userPosition.lng.toFixed(4)}</span>
                            </p>
                        </div>
                    </div>
                `;
                return div;
            }
        });

        const infoControl = new InfoControl({ position: 'topright' });
        infoControl.addTo(map);

        // Legend Control
        const LegendControl = Control.extend({
            onAdd: function (map) {
                const div = document.createElement('div');
                div.className = 'leaflet-control-legend';
                div.innerHTML = `
                    <div style="background: rgba(17, 24, 39, 0.9); backdrop-filter: blur(12px); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
                        <p style="color: #9ca3af; font-size: 11px; font-weight: 600; margin: 0 0 8px 0; letter-spacing: 0.05em;">LEGEND</p>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <img src="${meIcon}" alt="Your location" style="width: 20px; height: 20px;" />
                                <span style="color: #d1d5db; font-size: 12px;">Your Location</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <img src="${busIcon}" alt="Bus" style="width: 20px; height: 20px;" />
                                <span style="color: #d1d5db; font-size: 12px;">Bus Location</span>
                            </div>
                        </div>
                    </div>
                `;
                return div;
            }
        });

        const legendControl = new LegendControl({ position: 'bottomright' });
        legendControl.addTo(map);

        return () => {
            map.removeControl(infoControl);
            map.removeControl(legendControl);
        };
    }, [map, buses.length, userPosition]);

    return null;
}

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
            <div className='flex-1 w-full rounded-none overflow-hidden'>
                <MapContainer center={[userPosition.lat ? userPosition.lat : 0, userPosition.lng ? userPosition.lng : 0]} zoom={16} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='© OpenStreetMap contributors' />

                    <ChangeView lat={userPosition.lat} lng={userPosition.lng} />

                    <MapControls buses={buses} userPosition={userPosition} />

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

                </MapContainer>
            </div>
        </div>
    )
}

export default MapComponent