import express from "express";
import Authcontroller from "../controllers/authcontroller.js";
import {verifytoken,verifyrole} from '../middlewares/authmidlware.js'
const router= express.Router();


router.post('/register',Authcontroller.registeruser);
router.post('/login',Authcontroller.loginuser)
router.post('/admin/login',Authcontroller.loginuser)
router.get('/me', verifytoken, Authcontroller.getMe)
router.post('/create',verifytoken,verifyrole("admin"),Authcontroller.createadmin)
router.post('/forgot-password', Authcontroller.forgotPassword)

export default router