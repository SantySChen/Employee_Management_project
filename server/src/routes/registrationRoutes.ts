import { Router } from "express"
import { completeRegistration, generateRegistrationToken, verifyRegistrationToken } from "../controllers/registrationController"
import { isAuth, permit } from "../utils"

const router = Router()

router.post('/generate', isAuth, permit('HR'), generateRegistrationToken)
router.get('verify/:token', verifyRegistrationToken)
router.post('/complete', completeRegistration)

export default router