import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key';
  
  const token = jwt.sign({ userId }, secret, {
    expiresIn: '30d',
  });

  // Set JWT as HTTP-Only cookie (Optional, if using cookies, otherwise you can just return it in the body)
  // For standard MERN apps often cookies are used, but returning it in JSON is fine too.
  // We'll return it in the JSON body in the controller for simplicity and standard REST approach.
  
  return token;
};

export default generateToken;
