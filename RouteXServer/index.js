import { Server } from "socket.io";
import express from 'express'
import { createServer } from 'http';
import dotenv from 'dotenv';
import connectDB from "./db/connectDB.js";
dotenv.config();
import cors from 'cors';


import busRoutes from './routes/busRoutes.js';
import bus from './routes/bus.js';
import admin from './routes/admin.js';


const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: { origin: ['http://localhost:5173'], credentials: true }
});

// akk empty array rhe ga
// jse hi bus ki location update hogi
// wo bus ki location us array me push kr di jaye gi 
// agar nhi he to nwe bus add kar di jagi
const busLocations = [];




connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/bus' , bus);
app.use('/routes' , busRoutes);
app.use('/admin', admin);




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
            if(bus.busId === data.busId) {
                bus.lat = data.lat;
                bus.lng = data.lng;
                bus.speed = data.speed;
                bus.timestamp = data.timestamp;
                return true;
            }
    });
    if(!busExists.includes(true)) {
        busLocations.push(data);
    }
       
       
        io.emit("busUpdate", busLocations);
    })
});

httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});