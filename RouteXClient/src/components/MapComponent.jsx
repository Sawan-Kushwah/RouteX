import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Icon } from 'leaflet'
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
        iconSize: [30, 30]
    })

    const customUserLocationIcon = new Icon({
        iconUrl: meIcon,
        iconSize: [30, 30]
    })

    return (
        <div id="map" className='h-full w-full flex justify-center items-center'>
            <MapContainer center={[userPosition.lat ? userPosition.lat : 0, userPosition.lng ? userPosition.lng : 0]} zoom={16}>
                <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='OpenStreetMap ' />

                <ChangeView lat={userPosition.lat} lng={userPosition.lng} />

                <Marker position={[userPosition.lat, userPosition.lng]} icon={customUserLocationIcon}>
                    <Popup>
                        You are here
                    </Popup>
                </Marker>

                {buses.map(({ lat, lng, busId, speed }) => {
                    return (<Marker key={busId} position={[lat, lng]} icon={customBusIcon}>
                        <Popup>{busId} with speed of {speed}</Popup>
                    </Marker>)
                })}

            </MapContainer>
        </div>
    )
}

export default MapComponent