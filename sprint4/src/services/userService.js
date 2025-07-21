import userRepository from "../repositories/userRepository.js"


const createUser = (user) => {
  const isExistUser = userRepository.findByEmail(user.email);

}

export default{
  createUser,
}