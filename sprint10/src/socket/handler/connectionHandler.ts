import { Socket } from "socket.io";

export const connectedUsers = new Map<string, Set<string>>();

export const connectionHandler = (socket: Socket) => {
  const userId = socket.data.user.userId;

  console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
  
  // ConnectedUsers 맵에 사용자 추가
  if(!connectedUsers.has(userId)) connectedUsers.set(userId, new Set());
  connectedUsers.get(userId)?.add(socket.id);

  // 향후 각 유저가 접속한 모든 소켓에 알림을 보낼 수 있도록 유저별 방에 소켓을 추가
  // 룸을 사용하면 룸 ID로 emit 하면 해당 룸에 속한 모든 소켓에 알림 전송 가능
  // 룸을 사용하지 않으면 소켓 ID를 일일이 찾아서 emit 해야 함
  socket.join(`user:${userId}`);

  // 소켓 연결 해제 이벤트 처리
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userId}, Socket ID: ${socket.id}`);

    // connectedUsers 맵에서 소켓 ID 제거
    if(connectedUsers.has(userId)) {
      const userSockets = connectedUsers.get(userId);
      userSockets?.delete(socket.id);
      // 모든 소켓의 연결을 해제하면 맵에서 사용자 제거
      if(userSockets?.size === 0) connectedUsers.delete(userId);
    }
  });
}