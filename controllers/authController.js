// controllers/authController.js

import jwt from 'jsonwebtoken';
import { getUserData } from '../services/dbquery.js';

let refreshTokens = [];

export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre zorunludur' });
    }

    const userData = await getUserData(username, password);

    if (!userData || !areUserDataEqual(userData, username, password)) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const user = { name: userData.userName, isAdmin: userData.isAdmin };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    // Log the generated access token
/*     console.log('Generated Access Token:', accessToken); */

    // Store the refresh token in the global array
    refreshTokens.push(refreshToken);

    res.json({
      user: {
        name: user.name,
        isAdmin: user.isAdmin,
      },
      accessToken,
      refreshToken,
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'İç sunucu hatası' });
  }
};



export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ error: 'Token is required for logout' });
    }

    const isValidToken = verifyToken(token);

    if (!isValidToken) {
      return res.status(401).json({ error: 'Invalid token provided for logout' });
    }

    // Remove the token from the global array
    refreshTokens = refreshTokens.filter((storedToken) => storedToken !== token);

    // Log the removed access token
/*     console.log('Removed Access Token:', token); */

    res.sendStatus(204);

  } catch (error) {
    res.status(500).json({ error });
  }
};
  
  function areUserDataEqual(userData, username, password) {
    return userData.userName === username && userData.password === password;
  }
  
  const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
  };
  
  function verifyToken(token) {
    try {
     
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return decoded;
    } catch (error) {
      // If verification fails, return false
      return false;
    }
  }
