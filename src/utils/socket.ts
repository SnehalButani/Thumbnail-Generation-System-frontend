import { io, Socket } from "socket.io-client";

export interface JobUpdate {
    jobId: string; 
    status: 'pending' | 'queued' | 'processing' | 'completed' | 'failed';
    thumbnailUrl?: string;
}

let socket: Socket | null = null;
export const getSocket = () => {
    if (!socket) throw new Error("Socket not initialized");
    return socket;
};

export const connectSocket = (token: string): Promise<Socket> => {
    return new Promise((resolve, reject) => {
        socket = io(import.meta.env.VITE_API_URL , {
            auth: { token },
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('Socket connected');
            resolve(socket!);
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            reject(err);
        });
    });
};

export const subscribeToJobUpdates = (
    jobId: string,
    callback: (data: JobUpdate) => void
): (() => void) => {
    const currentSocket = getSocket();
    
    currentSocket.emit("subscribeJob", jobId);
    currentSocket.on("jobUpdate", callback);
    
    return () => {
        currentSocket.off("jobUpdate", callback);
    };
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};