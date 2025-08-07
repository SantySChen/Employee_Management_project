import { json, Router, urlencoded } from "express"
import authRoutes from "./authRoutes"
import registrationRoutes from "./registrationRoutes"
import onboardingRoutes from "./onboardingRoutes"
import hrRoutes from "./hrRoutes"
import visaRoutes from "./visaRoutes"

const router = Router()

router.use('/auth', json(), urlencoded({ extended: true }), authRoutes)
router.use('/registration', json(), urlencoded({ extended: true }), registrationRoutes)
router.use('/onboarding', onboardingRoutes)
router.use('/hr', json(), urlencoded({ extended: true }), hrRoutes)
router.use('/visa', json(), urlencoded({ extended: true }), visaRoutes)


export default router