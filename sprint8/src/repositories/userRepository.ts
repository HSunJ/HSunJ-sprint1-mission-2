import { User } from '@prisma/client';
import prisma from '../config/prisma';

async function findById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function save(userData: User) {
  return prisma.user.create({
    data: {
      ...userData
    },
  });
}

async function update(id: string, data: Partial<User>) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

// async function createOrUpdate(provider, providerId, email, name) {
//   return prisma.user.upsert({
//     where: { provider, providerId },
//     update: { email, name },
//     create: { provider, providerId, email, name },
//   });
// }

async function getProductById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      createdProducts: {
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
          likedUser: {
            where: { id },
            select: { id: true }
          }
        }
      }
    }
  })
}

async function getLikedProductList(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      likedProducts: {
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        }
      }
    }
  });
}

async function getArticleById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      createdArticles: {
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          likedUser: {
            where: { id },
            select: { id: true }
          }
        }
      }
    }
  })
}

async function getLikedArticleList(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      likedArticles: {
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        }
      }
    }
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
  // createOrUpdate,
  getProductById,
  getLikedProductList,
  getArticleById,
  getLikedArticleList
}
