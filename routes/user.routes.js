import express from 'express';
import { getUserData, login, register } from '../controller/user.controller.js';

const router= express.Router();

router.post('/register',register)
router.post('/login',login)
router.get('/data/:Id',getUserData )


export default router;