import { Router } from "express"
import authRoutes from "./authRoutes"
import registrationRoutes from "./registrationRoutes"
import onboardingRoutes from "./onboardingRoutes"
import hrRoutes from "./hrRoutes"
import visaRoutes from "./visaRoutes"

const router = Router()

router.use('auth', authRoutes)
router.use('registration', registrationRoutes)
router.use('onboarding', onboardingRoutes)
router.use('hr', hrRoutes)
router.use('visa', visaRoutes)


export default router