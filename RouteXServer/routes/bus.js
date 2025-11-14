import { Router } from "express";
const router = Router();
import controllerBus from '../controller/busController.js';

router.get('/getAllBuses', controllerBus.getAllBuses);
router.post('/addBus', controllerBus.addBus);
router.put('/updateBus/:id', controllerBus.updateBus);
router.delete('/deleteBus/:id', controllerBus.deleteBus);
router.get('/getBus/:id', controllerBus.getBusById);

export default router;