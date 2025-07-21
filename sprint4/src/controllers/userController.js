import userService from "../services/userService.js";

export const createUser = async (req, res, next) => {
  try {
    const { ...userData } = req.body;
    const user = await userService.createUser(userData);
    return res.status(201).json(user);
  } catch (error) {
    next(error)
  }

}