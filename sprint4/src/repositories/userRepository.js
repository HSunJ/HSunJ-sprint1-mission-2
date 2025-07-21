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

export default {
  findById,
  findByEmail,
  save,
  update,
  createOrUpdate,
}
