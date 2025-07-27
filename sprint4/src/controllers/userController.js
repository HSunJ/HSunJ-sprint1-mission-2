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
    // 로그인할때 액세스토큰과 리프래시토큰 발급
    const accessToken = await userService.createToken(user);
    const refreshToken = await userService.createToken(user, 'refresh');
    // 리프래시토큰 db에 저장
    await userService.updateUserInfo(user.id, { refreshToken });

    // 리프레시 토큰을 쿠키에 담아 전달
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });
    const response = {
      ...user,
      accessToken,
      message: "로그인에 성공했습니다"
    };
    return res.status(201).json(response);
    // return res.json({ accessToken });
    // return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.user.userId;
    const newAccessToken = await userService.refreshToken(userId, refreshToken);
    return res.json({ newAccessToken });
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

export const getLikedProducts = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const likedProductList = await userService.getLikedProductList(userId);
    res.status(200).json(likedProductList);
  }
  catch (error) {
    next(error);
  }
}

export const getUserArticles = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const artucleList = await userService.getArticles(userId);
    res.status(200).json(artucleList);
  } catch (error) {
    next(error);
  }
}

