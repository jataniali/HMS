import express from "express";
import doctordashboardcontroller from "../controllers/doctordashboardcontroller.js";
import {verifytoken,verifyrole} from '../middlewares/authmidlware.js';

const router= express.Router();
// DOCTOR MUSAT Login
router.use(verifytoken)
// only doctors can access
router.use(verifyrole("doctor"))

router.get('/profile',doctordashboardcontroller.getDoctorProfile);
router.put('/profile',doctordashboardcontroller.updateDoctorProfile);
router.get('/patients',doctordashboardcontroller.getassignedPatients);
router.get('/appointments',doctordashboardcontroller.getDoctorAppointments);
router.put('/appointments/:id',doctordashboardcontroller.updateAppointmentStatus);
router.post('/bills',doctordashboardcontroller.createBill);


export default router;

