"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoom = exports.joinRoom = void 0;
const joinRoom = (roomId, io, sockets) => {
    sockets.forEach((socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket)
            socket.join(roomId);
    });
};
exports.joinRoom = joinRoom;
const leaveRoom = (roomId, io, sockets) => {
    sockets.forEach((socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket)
            socket.leave(roomId);
    });
};
exports.leaveRoom = leaveRoom;
