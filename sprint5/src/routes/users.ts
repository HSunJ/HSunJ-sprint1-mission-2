import express from "express";

import { createUser, 
  login, 
  refreshToken, 
  getUserInfo, 
  updateUserInfo, 
  updateUserPassword, 
  getUserProducts, 
  getLikedProducts } from "../controllers/userController";
import auth from "../middlewares/auth";
import { asyncHandler } from "../middlewares/asyncHandler";

const userRouter = express.Router();

userRouter.route('/')
  .post(asyncHandler(createUser))

userRouter.route('/login')
  .post(asyncHandler(login))

userRouter.route('/token/refresh')
  .post(auth.verifyRefreshToken, asyncHandler(refreshToken))

userRouter.route('/info')
  .get(auth.verifyAccessToken, asyncHandler(getUserInfo))
  .patch(auth.verifyAccessToken, asyncHandler(updateUserInfo))

userRouter.route('/info/password')
  .patch(auth.verifyAccessToken, asyncHandler(updateUserPassword))

userRouter.route('/info/products')
  .get(auth.verifyAccessToken, asyncHandler(getUserProducts))

userRouter.route('/info/likedProducts')
  .get(auth.verifyAccessToken, asyncHandler(getLikedProducts))


export default userRouter;