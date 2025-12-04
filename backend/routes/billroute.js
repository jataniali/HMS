import express from "express";
import billcontroller from "../controllers/billcontroller.js";
import {verifytoken,verifyrole} from '../middlewares/authmidlware.js';
const router = express.Router();


router.use(verifytoken)
router.post('/', verifyrole('admin'),billcontroller.createBill);
router.get('/all',verifyrole('admin'),billcontroller.getAllBills);
router.get('/patient/:patientId',verifyrole("admin", "patient"),billcontroller.getPatientBils);
router.put('/:id',verifyrole("admin"),billcontroller.updateBills)
router.delete('/:id',verifyrole("admin"),billcontroller.deleteBill)

export default router