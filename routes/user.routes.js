import express from 'express';
import {   forgatpassword, getUserData, login, logout, register, resetpassword, verifypassword } from '../controller/user.controller.js';
import { authMiddleware } from '../middilewere/authmiddile.js';
import {    getattendence, markAttendance } from '../controller/attendence.controller.js';

const router= express.Router();
//h
router.post('/register',register)
router.post('/login', login)
router.get('/logout',logout )
router.get('/data',authMiddleware,getUserData )
router.post("/mark", markAttendance);
router.get("/:studentId", getattendence);
router.post("/sendpasswordlink", resetpassword);
router.get("/forgatpassword/:id/:token", forgatpassword);
router.post("/:id/:token", verifypassword);



export default router;