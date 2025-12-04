import express from 'express'
import appointmentController from '../controllers/appointmentcontroller.js'
import { verifyrole,verifytoken } from '../middlewares/authmidlware.js';

const router= express.Router();

router.use(verifytoken)


router.post('/',verifyrole("patient", "admin"),appointmentController.createAppointment);
router.get('/',  verifyrole("admin"),appointmentController.getallAppointments)
router.get('/mine',verifyrole("patient"),appointmentController.getPatientAppointments)
router.get('/doctor',verifyrole("doctor"),appointmentController.getDoctorAppointments)
router.get('/:id', appointmentController.getAppointmentById)
router.delete('/:id', verifyrole("admin", "doctor", "patient"),appointmentController.deleteAppointment)

export default router;