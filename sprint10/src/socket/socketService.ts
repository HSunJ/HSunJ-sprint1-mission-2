import { io } from "./index";

class SocketService {
  emitUser(userId: string, event: string, data: any) {
    io.to(`user:${userId}`).emit(event, data);
  }

  emitRoom(roomId: string, event: string, data: any) {
    io.to(roomId).emit(event, data);
  }
}

export default SocketService;