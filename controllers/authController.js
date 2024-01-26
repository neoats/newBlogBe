import jwt from "jsonwebtoken";
import { getUserData } from "../services/dbquery.js";
import client from "../services/redis.js";

export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const userData = await getUserData(usernameOrEmail);

    const user = {
      username: userData.userName,
      pwd: userData.password,
      isAdmin: userData.isAdmin,
    };

    if (!userData || userData.password !== password)
      return res.status(403).json({ error: "Invalid password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.json({
      user: {
        name: user.username,
        isAdmin: user.isAdmin,
      },
      accessToken,
      refreshToken,
    });
    set(user.username, refreshToken);
    /*     set(refreshToken); */
  } catch (error) {
    console.error("Giriş hatası:", error);
    res.status(500).json({ error: "İç sunucu hatası" });
  }
};

/* async function set(token) {
  try {
    await client.set(token, { ex: 100, nx: true });
  } catch (error) {
    console.log(error);
  }
} */

async function set(token, username) {
  try {
    await client.set(token, username, { ex: 100, nx: true });
  } catch (error) {
    console.log(error);
  }
}

/* async function set(username, token) {
  try {
    // Redis hash tipinde saklama
    await client.hset("tokens", username, token);
    // Opsiyonel: TTL (Geçerlilik Süresi) Ayarlama
    await client.expire("tokens", 100);
  } catch (error) {
    console.error(error);
  }
}
 */
function setRedisValueAsync(key, value) {
  return new Promise((resolve, reject) => {
    client.set(key, value, (err) => {
      if (err) {
        console.error(`Error setting value for key ${key} in Redis:`, err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
async function exampleCommands() {
  try {
    await kv.set("setExample", "123abc", { ex: 100, nx: true });
  } catch (error) {}
}

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

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const token = async (req, res) => {
  try {
    const refreshToken = req.body.token;

    if (!refreshToken) return sendErrorResponse(res, 403, "Token is required");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return sendErrorResponse(res, 403, "Token verification failed");

      const accessToken = generateAccessToken({ name: user.name });
      res.json({ accessToken });
    });
  } catch (error) {
    sendErrorResponse(res, 500, error.message || "Internal server error");
  }
};
export const getKeys = async (req, res) => {
  try {
    const keys = await client.keys("*");
    /*     const keys = await client.get("*"); */
    return res.json({
      keys,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* export async function getKeys() {
  try {
    const token = await client.hgetall("*");
    return token;
  } catch (error) {
    console.error(error);
  }
}
 */
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
