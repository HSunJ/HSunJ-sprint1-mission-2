import userRepository from "../repositories/userRepository.js";
import userService from "../services/userService.js";
import { hashPassword } from "../utils/hash.js";

export const createUser = async (req, res, next) => {
  try {
    const { password, salt } = await hashPassword(req.body.password);
    const userData = {
      ...req.body,
      password,
      salt,
    }

    const user = await userService.createUser(userData);
    return res.status(201).json(user);
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUser(email, password);
    const accessToken = await userService.createToken(user);
    const response = {
      ...user,
      accessToken,
      message: "로그인에 성공했습니다"
    }
    return res.status(201).json(response);
    // return res.json({ accessToken });
    // return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userInfo = await userService.getUserInfo(userId);
    res.status(201).json(userInfo);
  } catch (error) {
    next(error);
  }
};

export const updateUserInfo = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userData = req.body;
    const updatedUserInfo = await userService.updateUserInfo(userId, userData);
    res.status(201).json(updatedUserInfo);
  } catch (error) {
    next(error)
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { password, salt } = await hashPassword(req.body.password);
    const updatedPassword = await userService.updateUserPassword(userId, { password, salt });
    res.status(201).json({
      ...updatedPassword,
      message: "비밀번호가 변경되었습니다"
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProducts = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const productList = await userService.getProducts(userId);
    res.status(200).json(productList);
  } catch (error) {
    next(error);
  }
}

