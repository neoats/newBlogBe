// controllers/authController.js

import jwt from 'jsonwebtoken';
import { getUserData } from '../services/dbquery.js';
let refreshTokens = [];
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre zorunludur' });
    }

    const userData = await getUserData(username, password);

    if (!userData) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const user = { name: userData.userName };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    res.json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'İç sunucu hatası' });
  }
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
};

export const logout = (req, res) => {
    try {
      const { token } = req.body;
  
      if (!token) {
        return res.status(400).json({ error: 'Token is required for logout' });
      }
  
      // Assuming you have a valid token verification logic here
      const isValidToken = verifyToken(token); // Replace with your actual verification logic
  
      if (!isValidToken) {
        return res.status(401).json({ error: 'Invalid token provided for logout' });
      }
  
      // Remove the token from the global array
      refreshTokens = refreshTokens.filter((storedToken) => storedToken !== token);
  
      res.sendStatus(204);
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Internal server error during logout' });
    }
  };
  
  
  // Örnek bir refresh token oluşturucu fonksiyon
  const generateRefreshToken = () => {
    return Math.random().toString(36).slice(2);
  };