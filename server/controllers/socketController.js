
import { Server } from 'socket.io';

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "https://matjari-psi.vercel.app"], // frontend origins
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
        })
        socket.on('sent_message', (data) => {
            socket.to(data.room).emit("receive_message", data);
        })
        socket.on("mark_message_seen", ({ messageId, room }) => {
            // Update the "seen" status in the database (not shown here)
            // Emit the update to everyone in the room
            socket.to(room).emit("message_seen", { messageId });
        })
    });
};

