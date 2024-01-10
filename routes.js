// routes.js
import express from "express";
const router = express.Router();

import { login, logout, token , getKeys  }  from './controllers/authController.js';
import { test  }  from './controllers/testController.js';

//auth
router.post('/login', login);
router.post('/token', token)

router.delete('/logout', logout);

//test
router.get('/test',test);
router.get('/getKeys',getKeys)

export { router };
