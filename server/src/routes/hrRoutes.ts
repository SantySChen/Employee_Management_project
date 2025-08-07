import { Router } from "express"
import { getAllApprovedOnboardings, getAllOnboardings, searchOnboardings, searchOnboardingsByStatus, updateStatus } from "../controllers/hrController"

const router = Router()

router.get("/getAll", getAllOnboardings)
router.get("/search", searchOnboardings)
router.get("/searchByStatus", searchOnboardingsByStatus)
router.put("/onboardings/:id/status", updateStatus)
router.get("/onboardings/approved", getAllApprovedOnboardings)

export default router