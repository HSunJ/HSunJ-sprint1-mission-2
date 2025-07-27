import express from "express";

import { createUser, login, getUserInfo, updateUserInfo, updateUserPassword, getUserProducts } from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.route('/')
  .post(createUser)

userRouter.route('/login')
  .post(login)

userRouter.route('/info')
  .get(auth.verifyAccessToken, getUserInfo)
  .patch(auth.verifyAccessToken, updateUserInfo)

userRouter.route('/info/password')
  .patch(auth.verifyAccessToken, updateUserPassword)

userRouter.route('/info/products')
  .get(auth.verifyAccessToken, getUserProducts)
  

export default userRouter;