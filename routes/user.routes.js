import express from 'express';
import {   getUserData, login, logout, register } from '../controller/user.controller.js';
import { authMiddleware } from '../middilewere/authmiddile.js';
import {    getattendence, markAttendance } from '../controller/attendence.controller.js';

const router= express.Router();

router.post('/register',register)
router.post('/login', login)
router.get('/logout',logout )
router.get('/data',authMiddleware,getUserData )
router.post("/mark", markAttendance);
router.get("/:studentId", getattendence);



export default router;