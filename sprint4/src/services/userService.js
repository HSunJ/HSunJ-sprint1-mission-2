import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import userRepository from "../repositories/userRepository.js";
import productRepository from "../repositories/productRepository.js";
import { checkPassword } from "../utils/hash.js";

const createToken = async (user) => {
  const payload = { userId: user.id }
  const options = { expiresIn: '1h' }
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const createUser = async (user) => {
  const isExistUser = await userRepository.findByEmail(user.email);

  if (isExistUser) {
    const error = new Error("이미 존재하는 유저입니다.");
    error.code = 422;
    error.data = { email: user.email };
    throw error;
  };

  const newUser = await userRepository.save(user);
  return filterSensitiveUserDate(newUser);
};

const getUser = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('존재하지 않는 유저입니다');
    error.code = 401;
    throw error;
  };

  if (!checkPassword(password, user.password)) {
    const error = new Error('비밀번호가 틀렸습니다');
    error.code = 401;
    throw error;
  };

  return filterSensitiveUserDate(user);
};

const getUserInfo = async (userId) => {
  if (!userId) {
    const error = new Error('존재하지 않는 유저입니다');
    error.code = 401;
    throw error;
  }
  const userInfo = await userRepository.findById(userId);
  return filterSensitiveUserDate(userInfo);
};

const updateUserInfo = async (userId, userData) => {
  if (!userId) {
    const error = new Error('존재하지 않는 유저입니다');
    error.code = 401;
    throw error;
  }
  const updateUserInfo = await userRepository.update(userId, userData);
  return filterSensitiveUserDate(updateUserInfo);
};

const updateUserPassword = async (userId, data) => {
  if (!userId) {
    const error = new Error('존재하지 않는 유저입니다');
    error.code = 401;
    throw error;
  }

  const updatePassword = await userRepository.update(userId, data);
  return filterSensitiveUserDate(updatePassword);
}

const getProducts = async (userId) => {
  if (!userId) {
    const error = new Error('존재하지 않는 유저입니다');
    error.code = 401;
    throw error;
  }

  return await productRepository.getListById(userId);
}

const filterSensitiveUserDate = (userData) => {
  const { password, salt, ...unsensitiveData } = userData;
  return unsensitiveData;
};
export default {
  createToken,
  createUser,
  getUser,
  getUserInfo,
  updateUserInfo,
  updateUserPassword,
  getProducts,
};