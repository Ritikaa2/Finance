import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            const newSocket = io('http://localhost:5000', {
                // Passing user data on handshake if needed
            });
            setSocket(newSocket);

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
