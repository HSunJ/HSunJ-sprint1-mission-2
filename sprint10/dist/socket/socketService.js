"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class SocketService {
    constructor() {
        this.io = (0, index_1.getSocketIo)();
    }
    emitUser(userId, event, data) {
        this.io.to(`user:${userId}`).emit(event, data);
    }
    emitRoom(roomId, event, data) {
        this.io.to(roomId).emit(event, data);
    }
}
const socketService = new SocketService();
exports.default = socketService;
