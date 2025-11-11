import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      if (socket) {
        console.log("🔌 User logged out, closing socket");
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
      }
      return;
    }

    console.log("🔌 Creating socket for user:", currentUser._id);

    const newSocket = io("https://college-connect-backend-51sw.onrender.com", {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports:["websocket","polling"]
    });

    // Set socket IMMEDIATELY before events
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);

      // Emit user online event
      newSocket.emit("user:online", currentUser._id);
      console.log("📤 Emitted user:online for:", currentUser._id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected. Reason:", reason);
      setIsConnected(false);
    });

    newSocket.on("users:online", (users: string[]) => {
      console.log("👥 Received online users:", users);
      setOnlineUsers(users);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setIsConnected(false);
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up socket");
      if (currentUser) {
        newSocket.emit("user:offline", currentUser._id);
      }
      newSocket.disconnect();
      newSocket.removeAllListeners();
    };
  }, [currentUser?._id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
