import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const verifySocketToken = (socket: Socket, next: Function) => {
  const token = socket.handshake.auth.token;

  if(!token) {
    const err = new Error("인증 토큰이 없습니다.");
    return next(err);
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  socket.data.user = decoded;
  next();
}