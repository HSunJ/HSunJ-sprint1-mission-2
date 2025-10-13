import prisma from '../config/prisma'

class NotificationRepo {
  async create(targetId: string, data: any) {
    return prisma.notification.create({
      data: {
        userId: targetId,
        ...data
      }
    })
  }

  async createMany(notifications: any[]) {
    return prisma.notification.createMany({
      data: notifications
    })
  }

  async findByUserId(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  }

  async update(id: string, data: any) {
    return prisma.notification.update({
      where: { id },
      data
    })
  }
}

const notificationRepo = new NotificationRepo();
export default notificationRepo;