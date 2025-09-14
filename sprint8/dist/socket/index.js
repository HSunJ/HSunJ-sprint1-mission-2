"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketIo = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const socketAuth_1 = require("../middlewares/socketAuth");
const connectionHandler_1 = require("./handler/connectionHandler");
const notificationHandler_1 = require("./handler/notificationHandler");
const appError_1 = __importDefault(require("../utils/appError"));
let io;
const initializeSocket = (expressApp) => {
    const httpServer = (0, http_1.createServer)(expressApp);
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    io.use(socketAuth_1.verifySocketToken);
    io.on('connection', (socket) => {
        (0, connectionHandler_1.connectionHandler)(socket);
        (0, notificationHandler_1.getNotificationHandler)(socket);
    });
    return { io, httpServer };
};
exports.initializeSocket = initializeSocket;
const getSocketIo = () => {
    if (!io) {
        throw new appError_1.default.AppError("Socket.io가 초기화되지 않았습니다.", 500);
    }
    return io;
};
exports.getSocketIo = getSocketIo;
