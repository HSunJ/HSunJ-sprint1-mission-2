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
      message : "로그인에 성공했습니다"
    }
    return res.status(201).json(response);
    // return res.json({ accessToken });
    // return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}
