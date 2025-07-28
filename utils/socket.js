import { io } from "socket.io-client";

// Replace with your backend URL
let socket = io("https://socketclone.onrender.com", {
    reconnection: false,
    autoConnect: false

});

export default socket;

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}