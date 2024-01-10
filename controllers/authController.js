import jwt from "jsonwebtoken";
import { getUserData } from "../services/dbquery.js";

export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const userData = await getUserData(usernameOrEmail);

    const user = {
      name: userData.userName,
      pwd: userData.password,
      isAdmin: userData.isAdmin,
    };

    if (!userData || userData.password !== password)
      return res.status(403).json({ error: "Invalid password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    /*     client.set(refreshToken, "valid"); */
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.json({
      user: {
        name: user.name,
        isAdmin: user.isAdmin,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Giriş hatası:", error);
    res.status(500).json({ error: "İç sunucu hatası" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token)
      return res.status(400).json({ error: "Token is required for logout" });

    const isValidToken = verifyToken(token);

    if (!isValidToken) {
      return res
        .status(401)
        .json({ error: "Invalid token provided for logout" });
    }
    /* 
    client.del(token); */

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const token = async (req, res) => {
  try {
    const refreshToken = req.body.token;

    if (!refreshToken) return sendErrorResponse(res, 403, "Token is required");

    // Redis'te refresh token'ı kontrol et
    client.exists(refreshToken, async (err, reply) => {
      if (err || !reply) {
        return sendErrorResponse(res, 403, "Invalid refresh token");
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err)
            return sendErrorResponse(res, 403, "Token verification failed");

          const accessToken = generateAccessToken({ name: user.name });
          res.json({ accessToken });
        }
      );
    });
  } catch (error) {
    sendErrorResponse(res, 500, error.message || "Internal server error");
  }
};
export const getKeys = async () => {
  client.keys("*", (err, keys) => {
    if (err) {
      console.error("Error getting keys from Redis:", err);
      return;
    }

    keys.forEach((key) => {
      // Her bir key için Redis'ten değeri al ve consol log'a yazdır
      client.get(key, (err, value) => {
        if (err) {
          console.error(`Error getting value for key ${key} from Redis:`, err);
          return;
        }

        console.log(`Key: ${key}, Value: ${value}`);
      });
    });
  });
};

function areUserDataEqual(userData, username, password) {
  return userData.userName === username && userData.password === password;
}

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
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
