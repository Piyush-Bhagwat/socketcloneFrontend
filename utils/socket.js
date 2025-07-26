import { io } from "socket.io-client";

// Replace with your backend URL
const socket = io("https://socketclone.onrender.com", {
    reconnection: false,
    autoConnect: false

});

export default socket;

