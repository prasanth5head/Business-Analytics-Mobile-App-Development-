import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        if (userInfo._id) {
            const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
            setSocket(newSocket);

            newSocket.emit('join', userInfo._id);

            return () => newSocket.close();
        }
    }, [userInfo._id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
