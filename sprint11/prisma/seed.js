import { PrismaClient } from '@prisma/client';
import { PRODUCTS, ARTICLES, PRODUCTCOMENTS, ARTICLECOMENTS, USERS } from './mock';
import { hashPassword } from '../src/utils/hash';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  // 유저 데이터 삽입
  const createdUser = {};
  for (const userData of USERS) {
    const { plainPassword, ...rest } = userData;
    const { password, salt } = await hashPassword(plainPassword);

    const user = await prisma.user.create({
      data: {
        ...rest,
        password,
        salt,
      }
    })
    createdUser[user.email] = user.id; // 이메일을 key, 아이디를 value로 가지는 객체 생성
  };
  
  const userEmails = Object.keys(createdUser);
  if(userEmails.length === 0){
    console.error('생성된 유저 없음');
    return;
  };

  // 상품 데이터 삽입
  const createdProductId = [];
  for(const productData of PRODUCTS){
    const userId = getRandomUserId(createdUser, userEmails); // 유저 아이디 하나를 가져옴

    const product = await prisma.product.create({
      data:{
        ...productData,
        userId,
      }
    });
    createdProductId.push(product.id);
  };

  // 게시물 데이터 삽입
  const createdArticleId = [];
  for(const articleData of ARTICLES){
    const userId = getRandomUserId(createdUser, userEmails); // 유저 아이디 하나를 가져옴

    const article = await prisma.article.create({
      data:{
        ...articleData,
        userId,
      }
    });
    createdArticleId.push(article.id);
  };

  // 상품 댓글 데이터 삽입
  for(const commentData of PRODUCTCOMENTS){
    const userId = getRandomUserId(createdUser, userEmails);
    const productId = createdProductId[0];

    await prisma.productComment.create({
      data:{
        ...commentData,
        productId,
        userId,
      }
    });
  };

  // 게시물 댓글 데이터 삽입
  for(const commentData of ARTICLECOMENTS){
    const userId = getRandomUserId(createdUser, userEmails);
    const articleId = createdArticleId[0];

    await prisma.articleComment.create({
      data:{
        ...commentData,
        articleId,
        userId,
      }
    });
  };
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const getRandomUserId = (users, emails) => 
  users[emails[Math.floor(Math.random() * emails.length)]];
