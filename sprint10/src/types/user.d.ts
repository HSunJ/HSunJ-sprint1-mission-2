

export type DisplayUserProfile = {
  id: string;
  email: string;
  name: string;
  nickname: string | null;
  image: string | null;
  createdAt: Date;
};