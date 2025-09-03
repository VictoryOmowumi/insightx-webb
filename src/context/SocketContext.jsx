import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Use the production API URL for socket connection
    const socketUrl = import.meta.env.PROD 
      ? 'https://insightx-1ixfenb9u-victoryomowumis-projects.vercel.app'
      : 'http://localhost:5000';
    
    const newSocket = io(socketUrl, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const emit = (event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, emit }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;