import { Router } from 'express'
import adminController from '../controller/adminController.js'

const router = Router()

router.post('/login', adminController.adminLogin)

export default router
