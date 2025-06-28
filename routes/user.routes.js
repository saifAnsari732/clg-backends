import express from 'express';
import { getUserData, login, register } from '../controller/user.controller.js';
import { authMiddleware } from '../middilewere/authmiddile.js';

const router= express.Router();

router.post('/register',register)
router.post('/login', login)
router.get('/data',authMiddleware,getUserData )


export default router;