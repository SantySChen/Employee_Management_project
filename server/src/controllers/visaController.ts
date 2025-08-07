import { Request, Response } from "express";
import { VisaModel } from "../models/visaModel";

type VisaStepKey = "optReceipt" | "optEAD" | "i983" | "i20";

const isUploadAllowed = (visa: any, step: VisaStepKey): boolean => {
  switch (step) {
    case "optEAD":
      return visa.optReceipt?.status === "Approved";
    case "i983":
      return visa.optEAD?.status === "Approved";
    case "i20":
      return visa.i983?.status === "Approved";
    default:
      return true;
  }
};

export const createVisa = async (req: Request, res: Response) => {
  try {
    const { userId, optReceiptFile } = req.body;

    if (!userId || !optReceiptFile) {
      return res
        .status(400)
        .json({ message: "Missing userId or optReceiptFile" });
    }

    const existingVisa = await VisaModel.findOne({ userId });
    if (existingVisa) {
      return res
        .status(400)
        .json({ message: "Visa record already exists for this user" });
    }

    const visa = await VisaModel.create({
      userId,
      optReceipt: {
        file: optReceiptFile,
        status: "Pending",
        feedback: "",
      },
    });

    res.status(201).json(visa);
  } catch (err) {
    console.error("Visa Create Error:", err);
    res.status(500).json({ message: "Server error during visa creation" });
  }
};

export const uploadVisaStep = async (req: Request, res: Response) => {
  try {
    const { userId, step } = req.body;
    const file = req.file;

    if (!userId || !step || !file) {
      return res.status(400).json({ message: "Missing userId, step, or file" });
    }

    if (!["optReceipt", "optEAD", "i983", "i20"].includes(step)) {
      return res.status(400).json({ message: "Invalid visa step" });
    }

    const stepKey = step as VisaStepKey;

    const visa = await VisaModel.findOne({ userId });
    if (!visa) {
      return res.status(404).json({ message: "Visa record not found" });
    }

    if (!isUploadAllowed(visa, stepKey)) {
      return res.status(400).json({
        message: `You must wait for the previous step to be approved before uploading ${stepKey}`,
      });
    }

    visa[stepKey] = {
      file: (req.file as any).path,
      status: "Pending",
      feedback: "",
    };

    await visa.save();
    res.status(200).json(visa);
  } catch (err) {
    console.error("Visa Upload Error:", err);
    res.status(500).json({ message: "Server error during visa upload" });
  }
};

export const getVisaByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const visa = await VisaModel.findOne({ userId }).populate("userId");

    if (!visa) {
      return res.status(404).json({ message: "Visa record not found" });
    }

    res.status(200).json(visa);
  } catch (err) {
    console.error("Visa Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch visa record" });
  }
};

export const reviewVisaStep = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { step, status, feedback } = req.body;

    if (!["optReceipt", "optEAD", "i983", "i20"].includes(step)) {
      return res.status(400).json({ message: "Invalid visa step" });
    }

    const stepKey = step as VisaStepKey;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const visa = await VisaModel.findOne({ userId });
    if (!visa) {
      return res.status(404).json({ message: "Visa record not found" });
    }

    if (!visa[stepKey]) {
      return res
        .status(400)
        .json({ message: `No document uploaded for ${stepKey}` });
    }

    visa[stepKey]!.status = status;
    visa[stepKey]!.feedback = status === "Rejected" ? feedback : "";

    visa.markModified(stepKey);

    await visa.save();
    res.status(200).json(visa);
  } catch (err) {
    console.error("Visa Review Error:", err);
    res.status(500).json({ message: "Error during HR review" });
  }
};

export const getAllVisas = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await VisaModel.countDocuments();
    const visas = await VisaModel.find()
      .populate("userId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: visas,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    console.error("Get All Visas Error:", err);
    res.status(500).json({ message: "Failed to fetch visas" });
  }
};
