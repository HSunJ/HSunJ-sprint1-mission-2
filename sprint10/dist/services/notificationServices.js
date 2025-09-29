"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../socket");
const notificationRepo_1 = __importDefault(require("../repositories/notificationRepo"));
const socketService_1 = __importDefault(require("../socket/socketService"));
class NotificationService {
    createNotification(targetId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // 알림 생성
            const notification = yield notificationRepo_1.default.create(targetId, data);
            // 실시간 알림 전송
            const io = (0, socket_1.getSocketIo)();
            io.to(`user:${targetId}`).emit('notification', {
                id: notification.id,
                type: notification.type,
                content: notification.content,
                relatedId: notification.relatedId,
                createdAt: notification.createdAt
            });
            return notification;
        });
    }
    createPriceChangeNotifications(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, oldprice, newprice, likedUsers } = productData;
            const content = `${name}의 가격이 변경되었습니다: ${oldprice} -> ${newprice}`;
            const priceChangeNotifications = likedUsers.map(targetId => ({
                userId: targetId,
                type: 'PRODUCT_PRICE_CHANGE',
                content,
                relatedId: id,
            }));
            const createdNotifications = yield notificationRepo_1.default.createMany(priceChangeNotifications);
            socketService_1.default.emitRoom(`product:${id}`, 'price-change-notification', {
                message: content
            });
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield notificationRepo_1.default.findByUserId(userId);
            const unreadCount = notifications.filter(noti => !noti.isRead).length;
            return { notifications, unreadCount };
        });
    }
    markAsRead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return notificationRepo_1.default.update(id, { isRead: true });
        });
    }
}
const notificationService = new NotificationService();
exports.default = notificationService;
