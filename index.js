import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import {router} from './routes.js'

const app = express();


// Middleware
app.use(bodyParser.json());
app.use(cors({ credentials: true,origin:'*' }));
app.options('/login', cors());
dotenv.config();

/* 
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(403);
  if (!refreshToken.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Token verification failed
    }

    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

 */

app.use('/', router);



const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


