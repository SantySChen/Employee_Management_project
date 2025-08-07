import { Router } from "express"
import { upload } from "../utils";
import { createVisa, getAllVisas, getVisaByUserId, reviewVisaStep, uploadVisaStep } from "../controllers/visaController";

const router = Router()

router.post("/create", createVisa)
router.post("/upload", upload.single("file"), uploadVisaStep);
router.put("/review/:userId", reviewVisaStep);
router.get("/all", getAllVisas);
router.get("/:userId", getVisaByUserId);

export default router