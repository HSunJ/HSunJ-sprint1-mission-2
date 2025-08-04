import jwt from 'jsonwebtoken';
import { User } from "@prisma/client";

import userRepository from "../repositories/userRepository";
import appError from "../utils/appError";
import { DisplayUserProfile } from "../types/user";


const createToken = async (user: DisplayUserProfile, type: 'access' | 'refresh') => {
  const payload = { userId: user.id }
  const options = { expiresIn: type === 'refresh' ? '2w' : '12h' } as jwt.SignOptions;
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

const refreshToken = async (userId: string, refreshToken: string) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new appError.NotFoundError("존재하지 않는 유저입니다"); 
  }

  if (user.refreshToken !== refreshToken) {
    throw new appError.UnauthorizedError("유효하지 않은 리프레시 토큰입니다");
  }
  return createToken(user, 'access');
}

const checkExistingUser = async (email: string): Promise<boolean> => {
  const user = await userRepository.findByEmail(email);
  if (user) {
    return true;
  }
  return false;
}

const filterSensitiveUserData = (userData: User): DisplayUserProfile => {
  const { password, salt, refreshToken, ...unsensitiveData } = userData;
  return unsensitiveData;
};
export default {
  createToken,
  refreshToken,
  filterSensitiveUserData,
  checkExistingUser,
};