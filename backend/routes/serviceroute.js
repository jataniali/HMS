import express from "express";
import ServiceController from "../controllers/servicecontroller.js";
import { verifytoken, verifyrole } from '../middlewares/authmidlware.js';

const router = express.Router();

// Service routes
router.post('/', verifytoken, verifyrole('admin'), ServiceController.createService);
router.get('/', ServiceController.getAllServices); // Public access
router.get('/:id', verifytoken, verifyrole('admin', 'doctor'), ServiceController.getServiceById);
router.put('/:id', verifytoken, verifyrole('admin'), ServiceController.updateService);
router.delete('/:id', verifytoken, verifyrole('admin'), ServiceController.deleteService);

export default router;
