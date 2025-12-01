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



let busLocations = [];
io.on("connection", (socket) => {
    socket.on("busUpdate", (data) => {
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
            busLocations.push({ socketId: socket.id, ...data });
        }

        io.sockets.emit("broadcastingBuses", busLocations);
    })

    // HANDLE STOP TRANSMISSION
    socket.on("stopBusTransmission", ({ busId }) => {
        busLocations = busLocations.filter(bus => bus.busId !== busId);
        io.sockets.emit("broadcastingBuses", busLocations);
    });

    socket.on("disconnect", () => {
        busLocations = busLocations.filter(bus => bus.socketId !== socket.id);
        io.sockets.emit("broadcastingBuses", busLocations);
    });

});

httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});