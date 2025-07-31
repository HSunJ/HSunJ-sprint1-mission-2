import prisma from '../config/prisma.js';

async function save(review) {
  const createdReview = await prisma.review.create({
    data: {
      title: review.title,
      description: review.description,
      rating: review.rating,
      product: {
        connect: {
          id: review.productId,
        },
      },
      author: {
        connect: {
          id: review.authorId,
        },
      },
    },
  });
  return createdReview;
}

async function getById(id) {
  const review = await prisma.review.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
  return review;
}

async function getAll() {
  const reviews = await prisma.review.findMany();
  return reviews;
}

async function update(id, review) {
  const updatedReview = await prisma.review.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      title: review.title,
      description: review.description,
      rating: review.rating,
    },
  });
  return updatedReview;
}

async function deleteById(id) {
  const deletedReview = await prisma.review.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
  return deletedReview;
}

export default {
  save,
  getById,
  getAll,
  update,
  deleteById,
};
