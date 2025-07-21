import bcrypt from "bcrypt";

import userRepository from "../repositories/userRepository.js"
import { checkPassword } from "../utils/hash.js";


const createUser = async (user) => {
  const isExistUser = await userRepository.findByEmail(user.email);

  if (isExistUser) {
    const error = new Error("이미 존재하는 유저입니다.");
    error.code = 422;
    error.data = { email: user.email };
    throw error;
  }

  const newUser = await userRepository.save(user);
  return filterSensitiveUserDate(newUser);
}

const getUser = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('존재하지 않는 유저입니다');
    error.code = 401;
    throw error;
  }

  if (!checkPassword(password, user.password)) {
    const error = new Error('비밀번호가 틀렸습니다');
    error.code = 401;
    throw error;
  }

  return filterSensitiveUserDate(user);
}

const filterSensitiveUserDate = (userData) => {
  const { password, salt, ...unsensitiveData } = userData;
  return unsensitiveData;
}

export default {
  createUser,
  getUser,
}