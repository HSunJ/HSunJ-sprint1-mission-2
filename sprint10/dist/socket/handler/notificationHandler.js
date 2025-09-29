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
exports.getNotificationHandler = void 0;
const notificationServices_1 = __importDefault(require("../../services/notificationServices"));
const getNotificationHandler = (socket) => {
    const userId = socket.data.user.id;
    // 초기 접속 시 알림 목록과 읽지 않은 알림 개수 전송
    socket.on('get-notifications', (cb) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const notifications = yield notificationServices_1.default.getNotifications(userId);
            cb(notifications);
        }
        catch (error) {
            console.error("알림 불러오기 오류:", error);
            cb({ notifications: [], unreadCount: 0 });
        }
    }));
};
exports.getNotificationHandler = getNotificationHandler;
