import { Router } from "express";
import controllerBusRoute from '../controller/busRouteController.js';
const router = Router();
router.get('/getAllRoutes', controllerBusRoute.getAllRoutes);
router.post('/addRoute', controllerBusRoute.addRoute);
router.put('/updateRoute/:id', controllerBusRoute.updateRoute);
router.delete('/deleteRoute/:id', controllerBusRoute.deleteRoute);
router.get('/getRoute/:id', controllerBusRoute.getRouteById);
export default router;