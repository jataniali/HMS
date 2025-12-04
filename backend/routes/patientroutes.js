import express from 'express';
import PatientController from '../controllers/patientcontroller.js';
import {verifytoken,verifyrole} from '../middlewares/authmidlware.js';


const router= express.Router();


router.use(verifytoken)
router.use(verifyrole("admin","doctor"))

router.post('/',PatientController.createpatient);
router.get('/',PatientController.getallpatient);
router.get('/:id',PatientController.getsinglepatient);
router.put('/:id',PatientController.UpdatePatient);
router.delete('/:id',PatientController.deletepatient);

export default router;
