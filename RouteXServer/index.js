import { Server } from "socket.io";
import express from 'express'
import { createServer } from 'http';
import dotenv from 'dotenv';
import connectDB from "./db/connectDB.js";
dotenv.config();
import cors from 'cors';
const port = process.env.PORT || 3000;

import busRoutes from './routes/busRoutes.js';
import bus from './routes/bus.js';
import user from './routes/authentication.js';
import driver from './routes/busDriver.js';
import cookieParser from "cookie-parser";


const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: { origin: ['https://routexclient.onrender.com', 'http://localhost:5173'], credentials: true }
});

// akk empty array rhe ga
// jse hi bus ki location update hogi
// wo bus ki location us array me push kr di jaye gi 
// agar nhi he to nwe bus add kar di jagi
const busLocations = [];

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["https://routexclient.onrender.com", "http://localhost:5173"],  // your frontend URL
    credentials: true
}));
// parse cookies before route handlers so controllers can access `req.cookies`
app.use(cookieParser());
app.use('/bus', bus);
app.use('/routes', busRoutes);
app.use('/user', user);
app.use('/driver', driver)




// setInterval(() => {
//     busLocations.forEach(bus => {
//         bus.lat += (Math.random() - 0.5) * 0.01;
//         bus.lng += (Math.random() - 0.5) * 0.01;
//     }
//     );
//     io.emit("busUpdate", busLocations);
// }, 5000);


io.on("connection", (socket) => {
    console.log("connected ", socket.id)
    socket.on("busUpdate", (data) => {
        console.log("Received busUpdate:", data);
        // check if bus already exists in the array
        const busExists = busLocations.map((bus) => {
            if (bus.busId === data.busId) {
                bus.lat = data.lat;
                bus.lng = data.lng;
                bus.speed = data.speed;
                bus.timestamp = data.timestamp;
                return true;
            }
        });
        if (!busExists.includes(true)) {
            busLocations.push(data);
        }

        io.emit("busUpdate", busLocations);
    })

    // HANDLE STOP TRANSMISSION
    socket.on("stopBusTransmission", ({ busId }) => {
        console.log("Bus STOPPED transmitting:", busId);

        // Remove bus from array
        busLocations = busLocations.filter(bus => bus.busId !== busId);

        // Notify frontend that this bus stopped
        io.emit("busStopped", { busId });
    });

});

httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});