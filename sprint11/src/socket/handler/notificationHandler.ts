import { Socket } from "socket.io";
import notificationService from "../../services/notificationServices";

export const getNotificationHandler = (socket: Socket) => {
  const userId = socket.data.user.userId;

  // 초기 접속 시 알림 목록과 읽지 않은 알림 개수 전송
  (async () => {
    try {
      const notifications = await notificationService.getNotifications(userId);
      socket.emit('get-notifications', notifications);
    }
    catch (error) {
      console.error("알림 불러오기 오류:", error);
    }
  })();

  socket.on('get-notifications', async (cb) => {
    try {
      const notifications = await notificationService.getNotifications(userId);
      cb(notifications);
    }
    catch (error) {
      console.error("알림 불러오기 오류:", error);
      cb({ notifications: [], unreadCount: 0 });
    }
  });
}