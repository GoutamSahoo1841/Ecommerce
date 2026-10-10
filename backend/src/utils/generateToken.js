import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key';
  
  const accessToken = jwt.sign({ userId }, secret, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId }, refreshSecret, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key';
  return jwt.verify(token, refreshSecret);
};

export default generateToken;

