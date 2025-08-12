import { Router } from "express"
import { getAllApprovedOnboardings, getAllOnboardings, searchOnboardings, searchOnboardingsByStatus, updateStatus } from "../controllers/hrController"
import { isAuth, permit } from "../utils"

const router = Router()

router.get("/getAll", isAuth, permit('HR'), getAllOnboardings)
router.get("/search", isAuth, permit('HR'), searchOnboardings)
router.get("/searchByStatus", isAuth, permit('HR'), searchOnboardingsByStatus)
router.put("/onboardings/:id/status", updateStatus)
router.get("/onboardings/approved", isAuth, permit('HR'), getAllApprovedOnboardings)

export default router