import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'telejog_super_secret_jwt_key_2026_xyz123', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};
