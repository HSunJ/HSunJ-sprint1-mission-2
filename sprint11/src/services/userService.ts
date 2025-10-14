import jwt from 'jsonwebtoken';
import userRepository from "../repositories/userRepository";
import appError from "../utils/appError";
import { checkPassword } from '../utils/hash';

const signUp = async (userData) => {
  if (await userRepository.findByEmail(userData.email)) {
    throw new appError.ConflictError("이미 존재하는 유저입니다.");
  }
  return await userRepository.save(userData);
}

const logIn = async (email, password) => {
  const sensitiveUser = await userRepository.findByEmail(email);
  if (!sensitiveUser) throw new appError.NotFoundError("존재하지 않는 유저입니다");
  if (!await checkPassword(password, sensitiveUser.password)) throw new appError.UnauthorizedError("비밀번호가 틀렸습니다");

  const accessToken  = await createToken(sensitiveUser, 'access');
  const refreshToken = await createToken(sensitiveUser, 'refresh');
  await userRepository.update(sensitiveUser.id, { refreshToken });

  return {
    ...filterSensitiveUserData(sensitiveUser),
    accessToken,
    refreshToken
  }
}

const createToken = async (user, type) => {
  const payload = { userId: user.id }
  const options = { expiresIn: type === 'refresh' ? '2w' : '12h' } as jwt.SignOptions;
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

const refreshToken = async (userId, refreshToken) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new appError.NotFoundError("존재하지 않는 유저입니다"); 
  }

  if (user.refreshToken !== refreshToken) {
    throw new appError.UnauthorizedError("유효하지 않은 리프레시 토큰입니다");
  }
  return createToken(user, 'access');
}

const filterSensitiveUserData = (userData) => {
  const { password, salt, refreshToken, ...unsensitiveData } = userData;
  return unsensitiveData;
};
export default {
  signUp,
  logIn,
  createToken,
  refreshToken,
  filterSensitiveUserData,
};