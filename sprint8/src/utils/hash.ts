import bcrypt from "bcrypt";

export const hashPassword = async (plainPassword: string) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  const password = await bcrypt.hash(plainPassword, salt);
  return { password, salt };
}

export const checkPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
}