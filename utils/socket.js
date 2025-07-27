import { io } from "socket.io-client";

// Replace with your backend URL
const socket = io("http://localhost:3612", {
    reconnection: false,
    autoConnect: false

});

export default socket;

