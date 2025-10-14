import { User } from "@prisma/client";
import { hashPassword, checkPassword } from "../utils/hash";
import { RequestHandler } from "express";
import userService from "../services/userService";
import userRepository from "../repositories/userRepository";
import appError from "../utils/appError";

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { password, salt } = await hashPassword(req.body.password);
    const userData: User = {
      ...req.body,
      password,
      salt,
    }

    const newUser = await userService.signUp(userData);
    return res.status(201).json(userService.filterSensitiveUserData(newUser));
  } catch (error) {
    next(error)
  }
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const { refreshToken, ...user} = await userService.logIn(email, password);

    // 리프레시 토큰을 쿠키에 담아 전달
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });
    const response = {
      ...user,
      message: "로그인에 성공했습니다"
    };
    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    const userId = req.user?.userId as string;
    const newAccessToken = await userService.refreshToken(userId, refreshToken);
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
}

export const getUserInfo: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId as string;
    const userInfo = await userRepository.findById(userId);
    if (!userInfo) {
      throw new appError.NotFoundError("존재하지 않는 유저입니다");
    }
    res.status(201).json(userService.filterSensitiveUserData(userInfo));
  } catch (error) {
    next(error);
  }
};

export const updateUserInfo: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId as string;
    const userData: Partial<User> = req.body;
    const updatedUserInfo = await userRepository.update(userId, userData);
    res.status(201).json(userService.filterSensitiveUserData(updatedUserInfo));
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId as string;
    const user = await userRepository.findById(userId);
    const plainPassword: string = req.body.password;
    if (!user) {
      throw new appError.NotFoundError("존재하지 않는 유저입니다");
    }
    const { password, salt } = await hashPassword(plainPassword);
    const updatedPassword = await userRepository.update(userId, { password, salt });
    res.status(201).json({
      ...userService.filterSensitiveUserData(updatedPassword),
      message: "비밀번호가 변경되었습니다"
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProducts: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId as string;
    const productList = await userRepository.getProductById(userId);
    if (!productList) {
      throw new appError.NotFoundError("존재하지 않는 유저입니다");
    }

    const displayProductList = productList.createdProducts.map((product) => {
      const isLiked = product.likedUser.length > 0 ? true : false;
      const { likedUser, ...rest } = product;
      return {
        ...rest,
        isLiked
      };
    })
    res.status(200).json(displayProductList);
  } catch (error) {
    next(error);
  }
}

export const getLikedProducts: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId as string;
    const likedProductList = await userRepository.getLikedProductList(userId);
    if (!likedProductList) {
      throw new appError.NotFoundError("존재하지 않는 유저입니다");
    }

    const displayLikedProductList = likedProductList.likedProducts.map((product) => {
      return {
        ...product,
        isLiked: true
      }
    });
    res.status(200).json(displayLikedProductList);
  } catch (error) {
    next(error);
  }
}

export const getUserArticles: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId as string;
    const articleList = await userRepository.getArticleById(userId);
    if (!articleList) {
      throw new appError.NotFoundError("존재하지 않는 유저입니다");
    }

    const displayArticleList = articleList.createdArticles.map((article) => {
      const isLiked = article.likedUser.length > 0 ? true : false;
      const { likedUser, ...rest } = article;
      return {
        ...rest,
        isLiked
      };
    })
    res.status(200).json(displayArticleList);
  } catch (error) {
    next(error);
  }
}

export const getLikedArticles: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId as string;
    const likedArticleList = await userRepository.getLikedArticleList(userId);
    if (!likedArticleList) {
      throw new appError.NotFoundError("존재하지 않는 유저입니다");
    }
    const displayLikedArticleList = likedArticleList.likedArticles.map((article) => {
      return {
        ...article,
        isLiked: true
      }
    });
    res.status(200).json(displayLikedArticleList);
  } catch (error) {
    next(error);
  }
}

