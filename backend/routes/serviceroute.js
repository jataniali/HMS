import express from "express";
import ServiceController from "../controllers/servicecontroller.js";
import { verifytoken, verifyrole } from '../middlewares/authmidlware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifytoken);

// Service routes
router.post('/', verifyrole('admin'), ServiceController.createService);
router.get('/', verifyrole('admin', 'doctor', 'patient'), ServiceController.getAllServices);
router.get('/:id', verifyrole('admin', 'doctor'), ServiceController.getServiceById);
router.put('/:id', verifyrole('admin'), ServiceController.updateService);
router.delete('/:id', verifyrole('admin'), ServiceController.deleteService);

export default router;
