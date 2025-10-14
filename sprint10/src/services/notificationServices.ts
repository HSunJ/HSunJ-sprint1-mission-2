import { io } from "../socket";
import notificationRepo from "../repositories/notificationRepo";
import SocketService from "../socket/socketService";

interface PriceChangeParam {
  id: string;
  name: string;
  oldprice: number;
  newprice: number;
  likedUsers: string[];
}

class NotificationService {
  private socketService: SocketService;

  constructor() {
    this.socketService = new SocketService();
  }

  async createNotification(targetId: string, data: any) {
    // 알림 생성
    const notification = await notificationRepo.create(targetId, data);

    // 실시간 알림 전송
    io.to(`user:${targetId}`).emit('notification', {
      id: notification.id,
      type: notification.type,
      content: notification.content,
      relatedId: notification.relatedId,
      createdAt: notification.createdAt
    });

    return notification;
  }

  async createPriceChangeNotifications(productData: PriceChangeParam) {
    const { id, name, oldprice, newprice, likedUsers } = productData;
    const content = `${name}의 가격이 변경되었습니다: ${oldprice} -> ${newprice}`;
    const priceChangeNotifications = likedUsers.map(targetId => ({
      userId: targetId,
      type: 'PRODUCT_PRICE_CHANGE',
      content,
      relatedId: id
    }));
    
    const createdNotifications = await notificationRepo.createMany(priceChangeNotifications);
    for (const userId of likedUsers) {
      const { unreadCount } = await this.getNotifications(userId);
      this.socketService.emitUser(userId, 'price-change-notification', { 
        message: content,
        unreadCount 
      });
    }
    return createdNotifications;
  }

  async createArticleCommentNotification(commentData: any) {
    const userId = commentData.userId;
    const notificationData = {
      ...commentData,
      content: '새로운 댓글이 작성되었습니다.',
      type: 'ARTICLE_COMMENT'
    };

    const notification = await this.createNotification(userId, notificationData);
    const { unreadCount } = await this.getNotifications(userId);
    this.socketService.emitUser(userId, 'article-comment-notification', {
      message: notification.content,
      unreadCount
    })
  }

  async getNotifications(userId: string) {
    const notifications = await notificationRepo.findByUserId(userId);
    const unreadCount = notifications.filter(noti => !noti.isRead).length;
    return { notifications, unreadCount };
  }

  async markAsRead(id: string, userId: string) {
    await notificationRepo.update(id, { isRead: true });
    const { unreadCount } = await this.getNotifications(userId);
    return unreadCount;
  }
}

const notificationService = new NotificationService();
export default notificationService;