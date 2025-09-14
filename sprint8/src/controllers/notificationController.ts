import { RequestHandler } from "express";
import notificationService from "../services/notificationServices";

export const markAsRead: RequestHandler = async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user!.userId;

  const newUnreadCount = await notificationService.markAsRead(notificationId, userId);
  res.status(200).json({
    success: true,
    unreadCount: newUnreadCount
  })
}