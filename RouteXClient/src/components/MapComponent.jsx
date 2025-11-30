import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, ZoomControl } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useEffect, useState } from 'react'
import Control from "react-leaflet-custom-control";
import 'leaflet/dist/leaflet.css'
import socket from '../utils/socket'
import busIcon from '../assets/busicon.png'
import meIcon from '../assets/me.png'
import bgi from '../assets/bgi.png'
import centerPosition from '../assets/centerPosition.png'
import '../App.css'
import SearchBar from './SearchBar';
import useIsMobile from '../utils/useIsMobile';


function InfoBox({ buses, userPosition }) {
    return (
        <div
            className="mobileInfoContainer"

            style={{
                background: "rgba(17,24,39,0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: "8px",
                padding: "12px 16px",
                minWidth: "250px",
            }}
        >
            <div
                className='mobileInfoControl'
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                }}
            >
                <div
                    style={{
                        width: "10px",
                        height: "10px",
                        background: "#22c55e",
                        borderRadius: "50%",
                        animation: "pulse 2s infinite",
                    }}
                ></div>
                <p style={{ color: "#d1d5db", fontSize: "14px", margin: 0 }}>
                    <span style={{ fontWeight: 600, color: "white" }}>
                        {buses.length}
                    </span>{" "}
                    buses tracking
                </p>
            </div>

            <div className='hideMobile' style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                    style={{
                        width: "10px",
                        height: "10px",
                        background: "#3b82f6",
                        borderRadius: "50%",
                    }}
                ></div>
                <p style={{ color: "#d1d5db", fontSize: "14px", margin: 0 }}>
                    Your Location:{" "}
                    <span style={{ fontWeight: 600, color: "white" }}>
                        {userPosition.lat.toFixed(4)}, {userPosition.lng.toFixed(4)}
                    </span>
                </p>
            </div>
        </div>
    );
}

function LegendBox() {
    return (
        <div
            className="mobileInfoContainer"
            style={{
                background: "rgba(17,24,39,0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: "8px",
                padding: "12px 16px",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img src={meIcon} style={{ width: 20, height: 20 }} />
                    <span style={{ color: "#d1d5db", fontSize: "12px" }}>
                        Your Location
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img src={busIcon} style={{ width: 20, height: 20 }} />
                    <span style={{ color: "#d1d5db", fontSize: "12px" }}>
                        Bus Location
                    </span>
                </div>
            </div>
        </div>
    );
}




/* --------------------------- FIRST TIME CENTER COMPONENT --------------------------- */
function FirstCenter({ userPosition, hasCentered, setHasCentered }) {
    const map = useMap();

    useEffect(() => {
        if (!hasCentered && userPosition.lat !== 22.597843 && userPosition.lng !== 75.787305) {
            map.setView([userPosition.lat, userPosition.lng], 12);
            setHasCentered(true);
        }
        window._leaflet_map = map;
    }, [userPosition, hasCentered]);

    return null;
}



/* --------------------------- MAIN MAP COMPONENT --------------------------- */

const MapComponent = () => {
    const [buses, setBuses] = useState([]);
    const [userPosition, setuserPosition] = useState({ lat: 22.597843, lng: 75.787305 });
    const [destinationLocation] = useState({ lat: 22.597842505120706, lng: 75.78730493840565 });
    const [hasCentered, setHasCentered] = useState(false);

    const isMobile = useIsMobile();

    useEffect(() => {
        socket.on("broadcastingBuses", (data) => setBuses(data));
        return () => socket.off("broadcastingBuses");
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
                            map.setView([userPosition.lat, userPosition.lng], 14);
                        }
                    }}
                    className="absolute sm:bottom-30 bottom-38 right-4 z-9999 cursor-pointer bg-gray-200 text-white px-3 py-2 rounded shadow"
                    title='Center on me'
                >
                    <img src={centerPosition} alt="Center on me" className='w-7 h-7' />
                </button>



                <MapContainer
                    center={[0, 0]}
                    zoom={16}
                    zoomControl={false}
                    style={{ height: "100%", width: "100%" }}
                >

                    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <FirstCenter
                        userPosition={userPosition}
                        hasCentered={hasCentered}
                        setHasCentered={setHasCentered}
                    />


                    <Marker position={[userPosition.lat, userPosition.lng]} icon={customUserLocationIcon}>
                        <Tooltip permanent direction="right" offset={[10, 0]}>
                            <span className="font-semibold text-[10px] text-blue-700">You</span>
                        </Tooltip>
                        <Popup className='custom-popup'>
                            <div className='text-center'>
                                <p className='font-bold text-gray-800'>Your Location</p>
                                <p className='text-xs text-gray-600 mt-1'>{userPosition.lat.toFixed(6)}, {userPosition.lng.toFixed(6)}</p>
                            </div>
                        </Popup>
                    </Marker>

                    <Marker position={[destinationLocation.lat, destinationLocation.lng]} icon={customDestinationLocationIcon}>
                        <Tooltip permanent direction="right" offset={[10, 0]}>
                            <div className="font-semibold text-[10px] text-blue-700">
                                <div>
                                    Sushila Devi Bansal
                                </div>
                                <div>
                                    College Of Technology
                                </div>
                            </div>
                        </Tooltip>
                        <Popup className='custom-popup'>
                            <div className='text-center'>
                                <p className='font-bold text-gray-800'>Sushila Devi Bansal College, BGI Indore</p>
                                <p className='text-xs text-gray-600 mt-1'>{destinationLocation.lat.toFixed(6)}, {destinationLocation.lng.toFixed(6)}</p>
                            </div>
                        </Popup>
                    </Marker>



                    <ZoomControl position="bottomleft" zoomInText="🧐" zoomOutText="🗺️" />

                    <Control position="bottomright">
                        <LegendBox />
                    </Control>

                    <Control position={isMobile ? "bottomleft" : "topright"}>
                        <InfoBox buses={buses} userPosition={userPosition} />
                    </Control>

                    <Control position="topleft">
                        <SearchBar />
                    </Control>

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