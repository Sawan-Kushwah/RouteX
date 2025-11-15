import { Router } from "express";
const router = Router();
import busDriverController from '../controller/busDriverController.js';

router.post('/addDriver', busDriverController.addDriver);
router.get('/getAllDrivers', busDriverController.getAllDrivers);
router.put('/updateDriver/:id', busDriverController.updateDriver);
router.delete('/deleteDriver/:id', busDriverController.deleteDriver);


export default router;
