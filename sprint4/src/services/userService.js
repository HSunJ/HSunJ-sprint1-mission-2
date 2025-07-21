import userRepository from "../repositories/userRepository.js"


const createUser = async (user) => {
  const isExistUser = userRepository.findByEmail(user.email);

  if(isExistUser){
    const error = new Error("이미 존재하는 유저입니다.");
    error.code = 422;
    error.data = { email: user.email };
    throw error;
  }

  const newUser = await userRepository.save(user);
  return filterSensitiveUserDate(newUser);
}

const filterSensitiveUserDate = (userData) => {
  const { password, ...unsensitiveData } = userData;
  return unsensitiveData;
}

export default{
  createUser,
}