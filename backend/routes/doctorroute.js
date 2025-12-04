import express from 'express';
import DoctorController from '../controllers/doctorcontroller.js';
import {verifytoken,verifyrole} from '../middlewares/authmidlware.js';
import {upload } from '../controllers/uploadcontroller.js'

const router= express.Router();

router.use(verifytoken)


router.post('/',upload.single("profileimage"), verifyrole("admin"),DoctorController.createDoctor);
router.get('/' , verifyrole("admin","doctor","patient"),DoctorController.getAlldoctors);
router.put('/:id' , verifyrole("admin"),DoctorController.updateDoctor);
router.delete('/:id' , verifyrole("admin"),DoctorController.deleteDoctor);

export default router;