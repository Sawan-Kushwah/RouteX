import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Icon, Control } from 'leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import socket from '../utils/socket'
import busIcon from '../assets/busicon.png'
import meIcon from '../assets/me.png'
import bgi from '../assets/bgi.png'
import centerPosition from '../assets/centerPosition.png'
import '../App.css'



/* --------------------------- MAP CONTROLS --------------------------- */
function MapControls({ buses, userPosition }) {
    const map = useMap();

    useEffect(() => {
        const InfoControl = Control.extend({
            onAdd: function () {
                const div = document.createElement('div');
                div.className = 'leaflet-control-info';
                div.innerHTML = `
                    <div style="background: rgba(17,24,39,0.9); backdrop-filter: blur(12px); border: 1px solid rgba(168,85,247,0.3); border-radius: 8px; padding: 12px 16px; min-width: 250px;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                            <div style="width:10px;height:10px;background:#22c55e;border-radius:50%;animation:pulse 2s infinite;"></div>
                            <p style="color:#d1d5db;font-size:14px;margin:0;">
                                <span style="font-weight:600;color:white;">${buses.length}</span> buses tracking
                            </p>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <div style="width:10px;height:10px;background:#3b82f6;border-radius:50%;"></div>
                            <p style="color:#d1d5db;font-size:14px;margin:0;">
                                Your Location: <span style="font-weight:600;color:white;">${userPosition.lat.toFixed(4)}, ${userPosition.lng.toFixed(4)}</span>
                            </p>
                        </div>
                    </div>
                `;
                return div;
            }
        });

        const LegendControl = Control.extend({
            onAdd: function () {
                const div = document.createElement('div');
                div.className = 'leaflet-control-legend';
                div.innerHTML = `
                    <div style="background:rgba(17,24,39,0.9);backdrop-filter:blur(12px);border:1px solid rgba(168,85,247,0.3);border-radius:8px;padding:12px 16px;">
                        <p style="color:#9ca3af;font-size:11px;font-weight:600;margin:0 0 8px;">LEGEND</p>
                        <div style="display:flex;flex-direction:column;gap:8px;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <img src="${meIcon}" style="width:20px;height:20px;" />
                                <span style="color:#d1d5db;font-size:12px;">Your Location</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <img src="${busIcon}" style="width:20px;height:20px;" />
                                <span style="color:#d1d5db;font-size:12px;">Bus Location</span>
                            </div>
                        </div>
                    </div>
                `;
                return div;
            }
        });

        const infoControl = new InfoControl({ position: 'topright' });
        const legendControl = new LegendControl({ position: 'bottomright' });

        infoControl.addTo(map);
        legendControl.addTo(map);

        return () => {
            map.removeControl(infoControl);
            map.removeControl(legendControl);
        };
    }, [buses.length, userPosition]);

    return null;
}



/* --------------------------- FIRST TIME CENTER COMPONENT --------------------------- */
function FirstCenter({ userPosition, hasCentered, setHasCentered }) {
    const map = useMap();

    useEffect(() => {
        if (!hasCentered && userPosition.lat !== 0 && userPosition.lng !== 0) {
            map.setView([userPosition.lat, userPosition.lng], 16);
            setHasCentered(true);
        }

        // store instance for external button
        window._leaflet_map = map;
    }, [userPosition, hasCentered]);

    return null;
}



/* --------------------------- MAIN MAP COMPONENT --------------------------- */

const MapComponent = () => {
    const [buses, setBuses] = useState([]);
    const [userPosition, setuserPosition] = useState({ lat: 0, lng: 0 });
    const [destinationLocation] = useState({ lat: 22.597842505120706, lng: 75.78730493840565 });
    const [hasCentered, setHasCentered] = useState(false);


    /* SOCKET BUS UPDATES */
    useEffect(() => {
        socket.on("busUpdate", (data) => setBuses(data));
        return () => socket.off("busUpdate");
    }, []);


    /* GEOLOCATION WATCH */
    useEffect(() => {
        let watchId;

        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setuserPosition({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                },
                (err) => console.error(err),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 1000 }
            );
        }

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);



    /* ICONS */
    const customBusIcon = new Icon({
        iconUrl: busIcon,
        iconSize: [35, 35],
        iconAnchor: [17, 35]
    });

    const customUserLocationIcon = new Icon({
        iconUrl: meIcon,
        iconSize: [35, 35],
        iconAnchor: [17, 35]
    });

    const customDestinationLocationIcon = new Icon({
        iconUrl: bgi,
        iconSize: [40, 40],
        iconAnchor: [17, 35]
    });



    return (
        <div className="h-full w-full flex flex-col relative bg-gray-800">
            <div className="flex-1 w-full overflow-hidden">

                <button
                    onClick={() => {
                        const map = window._leaflet_map;
                        if (!navigator.geolocation) {
                            return;
                        }
                        if (map && userPosition.lat) {
                            map.setView([userPosition.lat, userPosition.lng], 16);
                        }
                    }}
                    className="absolute bottom-32 right-4 z-9999 cursor-pointer bg-gray-200 text-white px-3 py-2 rounded shadow"
                    title='Center on me'
                >
                    <img src={centerPosition} alt="Center on me" className='w-7 h-7' />
                </button>

                <MapContainer
                    center={[0, 0]}
                    zoom={16}
                    style={{ height: "100%", width: "100%" }}
                >

                    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <FirstCenter
                        userPosition={userPosition}
                        hasCentered={hasCentered}
                        setHasCentered={setHasCentered}
                    />

                    <MapControls buses={buses} userPosition={userPosition} />

                    <Marker position={[userPosition.lat, userPosition.lng]} icon={customUserLocationIcon}>
                        <Popup className='custom-popup'>
                            <div className='text-center'>
                                <p className='font-bold text-gray-800'>Your Location</p>
                                <p className='text-xs text-gray-600 mt-1'>{userPosition.lat.toFixed(6)}, {userPosition.lng.toFixed(6)}</p>
                            </div>
                        </Popup>
                    </Marker>

                    <Marker position={[destinationLocation.lat, destinationLocation.lng]} icon={customDestinationLocationIcon}>
                        <Popup className='custom-popup'>
                            <div className='text-center'>
                                <p className='font-bold text-gray-800'>Sushila Devi Bansal College, BGI Indore</p>
                                <p className='text-xs text-gray-600 mt-1'>{destinationLocation.lat.toFixed(6)}, {destinationLocation.lng.toFixed(6)}</p>
                            </div>
                        </Popup>
                    </Marker>
                    {/* BUSES */}
                    {buses.map(({ lat, lng, busNo, speed, timestamp }) => (
                        <Marker key={busNo} position={[lat, lng]} icon={customBusIcon}>
                            <Popup>
                                <div className="text-center">
                                    <p className="font-bold">Bus #{busNo}</p>
                                    <p className="text-sm">Speed: {(speed * 3.6).toFixed(2)} km/h</p>
                                    <p className="text-xs">{new Date(timestamp).toLocaleTimeString()}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                </MapContainer>
            </div>
        </div>
    );
};

export default MapComponent;
