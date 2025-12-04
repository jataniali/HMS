import express from 'express';
import DoctorController from '../controllers/doctorcontroller.js';
import {verifytoken,verifyrole} from '../middlewares/authmidlware.js';
import {upload } from '../controllers/uploadcontroller.js'

const router= express.Router();

router.post('/',verifytoken, upload.single("profileimage"), verifyrole("admin"),DoctorController.createDoctor);
router.get('/' , DoctorController.getAlldoctors); // Public access
router.put('/:id' , verifytoken, verifyrole("admin"),DoctorController.updateDoctor);
router.delete('/:id' , verifytoken, verifyrole("admin"),DoctorController.deleteDoctor);

export default router;