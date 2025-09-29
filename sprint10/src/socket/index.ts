import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { verifySocketToken } from '../middlewares/socketAuth';
import { connectionHandler } from './handler/connectionHandler';
import { getNotificationHandler } from './handler/notificationHandler';

export let io: Server;

export const initializeSocket = (expressApp: express.Application) => {
  const httpServer = createServer(expressApp);
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(verifySocketToken);

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    connectionHandler(socket);
    getNotificationHandler(socket);
  });

  return { io, httpServer };
}