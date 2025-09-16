"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionHandler = exports.connectedUsers = void 0;
exports.connectedUsers = new Map();
const connectionHandler = (socket) => {
    var _a;
    const userId = socket.data.user.id;
    console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
    // ConnectedUsers 맵에 사용자 추가
    if (!exports.connectedUsers.has(userId))
        exports.connectedUsers.set(userId, new Set());
    (_a = exports.connectedUsers.get(userId)) === null || _a === void 0 ? void 0 : _a.add(socket.id);
    // 향후 각 유저가 접속한 모든 소켓에 알림을 보낼 수 있도록 유저별 방에 소켓을 추가
    // 룸을 사용하면 룸 ID로 emit 하면 해당 룸에 속한 모든 소켓에 알림 전송 가능
    // 룸을 사용하지 않으면 소켓 ID를 일일이 찾아서 emit 해야 함
    socket.join(`user:${userId}`);
    // 소켓 연결 해제 이벤트 처리
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}, Socket ID: ${socket.id}`);
        // connectedUsers 맵에서 소켓 ID 제거
        if (exports.connectedUsers.has(userId)) {
            const userSockets = exports.connectedUsers.get(userId);
            userSockets === null || userSockets === void 0 ? void 0 : userSockets.delete(socket.id);
            // 모든 소켓의 연결을 해제하면 맵에서 사용자 제거
            if ((userSockets === null || userSockets === void 0 ? void 0 : userSockets.size) === 0)
                exports.connectedUsers.delete(userId);
        }
    });
};
exports.connectionHandler = connectionHandler;
