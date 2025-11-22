// socket.js
import { io } from "socket.io-client";
import server from "./backendServer";

const socket = io(`${server}`, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
