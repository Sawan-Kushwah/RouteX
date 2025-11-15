import { Router } from 'express'
import authenticationController from '../controller/authenticationController.js'

const router = Router()

router.post('/login', authenticationController.login)
router.get('/verify', authenticationController.verifyToken)
router.get('/logout' , authenticationController.logout);

export default router
