import { Router } from "express"
import { upload } from "../utils";
import { create, getOnboardingByUserId, updateOnboardingByUserId } from "../controllers/onboardingController";

const router = Router()


router.post(
  "/",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "driverLicense", maxCount: 1 },
    { name: "workAuth", maxCount: 1 },
  ]),
  create
);
router.get("/:userId", getOnboardingByUserId);
router.put(
  "/:userId",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "driverLicense", maxCount: 1 },
    { name: "workAuth", maxCount: 1 },
  ]),
  updateOnboardingByUserId
);

export default router