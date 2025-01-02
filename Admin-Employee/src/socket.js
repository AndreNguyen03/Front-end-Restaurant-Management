import { io } from "socket.io-client";


const socket = io("http://localhost:3056", {
  autoConnect: false, 
});


export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log("Socket connected");
  }
};


export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};

export default socket;
