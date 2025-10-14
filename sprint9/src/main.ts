import app from "./app";
import { initializeSocket } from './socket/index';

const { httpServer } = initializeSocket(app);
httpServer.listen(process.env.PORT || 3000, () => console.log('Server Started'));