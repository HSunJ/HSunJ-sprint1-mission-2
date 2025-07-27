import express from "express";

import { createUser, login, refreshToken, getUserInfo, updateUserInfo, updateUserPassword, getUserProducts, getLikedProducts } from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.route('/')
  .post(createUser)

userRouter.route('/login')
  .post(login)

userRouter.route('/token/refresh')
  .post(auth.verifyRefreshToken, refreshToken)

userRouter.route('/info')
  .get(auth.verifyAccessToken, getUserInfo)
  .patch(auth.verifyAccessToken, updateUserInfo)

userRouter.route('/info/password')
  .patch(auth.verifyAccessToken, updateUserPassword)

userRouter.route('/info/products')
  .get(auth.verifyAccessToken, getUserProducts)

userRouter.route('/info/likedProducts')
  .get(auth.verifyAccessToken, getLikedProducts)
  

export default userRouter;