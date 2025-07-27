import prisma from '../config/prisma.js';

async function findById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email) {
  return await prisma.User.findUnique({
    where: {
      email,
    },
  });
}

async function save(user) {
  return prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password: user.password,
      salt: user.salt,
    },
  });
}

async function update(id, data) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

async function createOrUpdate(provider, providerId, email, name) {
  return prisma.user.upsert({
    where: { provider, providerId },
    update: { email, name },
    create: { provider, providerId, email, name },
  });
}

async function getProductById(id) {
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

async function getLikedProductList(id) {
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

async function getArticleById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      createdArticles: {
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

async function getLikedArticleList(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      likedArticles: {
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

export default {
  findById,
  findByEmail,
  save,
  update,
  createOrUpdate,
  getProductById,
  getLikedProductList,
  getArticleById,
  getLikedArticleList
}
