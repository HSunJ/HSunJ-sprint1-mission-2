import { Server } from "socket.io";

export const joinRoom = (roomId: string, io: Server, sockets: Set<string>) => {
  sockets.forEach((socketId) => {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) socket.join(roomId);
  });
}

export const leaveRoom = (roomId: string, io: Server, sockets: Set<string>) => {
  sockets.forEach((socketId) => {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) socket.leave(roomId);
  });
}