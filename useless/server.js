const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// Secret key for JWT
const secretKey = '1111'; // Replace with your actual secret key

app.post('/login', (req, res) => {
  const username = req.body.username;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const user = { name: username };

  jwt.sign(user, secretKey, (err, token) => {
    if (err) {
      console.error('Error creating JWT:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ accessToken: token });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


function authenticateToken(req, res, next) {

  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]


  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden - Invalid token' });
    }

 
    req.user = user;
    next();
  });
}
