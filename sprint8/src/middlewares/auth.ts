import { expressjwt } from "express-jwt";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ['HS256'],
  requestProperty: 'user',
});

// userId가 선택적으로 필요한 경우에 사용
const verifyAccessTokenOptional = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ['HS256'],
  requestProperty: 'user',
  credentialsRequired: false
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
  requestProperty: 'user'
})

export default {
  verifyAccessToken,
  verifyAccessTokenOptional,
  verifyRefreshToken,
}