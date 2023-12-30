// routes.js
import express from "express";
const router = express.Router();

import { login, logout  }  from './controllers/authController.js';
import { test  }  from './controllers/testController.js';

//auth
router.post('/login', login);

router.delete('/logout', logout);

//test
router.get('/test',test);

export { router };
