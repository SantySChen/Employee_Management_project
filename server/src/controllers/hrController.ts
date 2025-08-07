import { Request, Response } from "express";
import { OnboardingModel } from "../models";

export const getAllOnboardings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [onboardings, total] = await Promise.all([
      OnboardingModel.find()
        .sort({ lastName: 1 })
        .skip(skip)
        .limit(limit)
        .populate("userId"),
      OnboardingModel.countDocuments()
    ]);

    res.status(200).json({
      onboardings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error("Error fetching onboardings:", error);
    res.status(500).json({ message: "Failed to retrieve onboardings" });
  }
};


export const searchOnboardings = async (req: Request, res: Response) => {
  const { name, page = "1", field } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Name query parameter is required" });
  }

  const validFields = ["firstName", "lastName", "preferredName"];
  if (!field || typeof field !== "string" || !validFields.includes(field)) {
    return res.status(400).json({ message: "Invalid field" });
  }

  const pageNum = parseInt(page as string, 10);
  const limit = 10;
  const skip = (pageNum - 1) * limit;
  const regex = new RegExp(name, "i");

  try {
    const query = { [field]: regex };

    const [results, total] = await Promise.all([
      OnboardingModel.find(query)
        .sort({ lastName: 1 })
        .skip(skip)
        .limit(limit)
        .populate("userId"),
      OnboardingModel.countDocuments(query),
    ]);

    res.status(200).json({
      onboardings: results,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error("Error searching onboardings:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

export const searchOnboardingsByStatus = async (req: Request, res: Response) => {
  const { status, page = "1" } = req.query;

  if (!status || typeof status !== "string") {
    return res.status(400).json({ message: "Status query parameter is required" });
  }

  const pageNum = parseInt(page as string, 10);
  const limit = 10;
  const skip = (pageNum - 1) * limit;

  try {
    const query = { status };

    const [results, total] = await Promise.all([
      OnboardingModel.find(query)
        .sort({ lastName: 1 })
        .skip(skip)
        .limit(limit)
        .populate("userId"),
      OnboardingModel.countDocuments(query),
    ]);

    res.status(200).json({
      onboardings: results,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error("Error searching onboardings by status:", error);
    res.status(500).json({ message: "Search by status failed" });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  const validStatuses = ["Pending", "Approved", "Rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const onboarding = await OnboardingModel.findById(id);
    if (!onboarding) {
      return res.status(404).json({ message: "Onboarding record not found." });
    }

    onboarding.status = status;
    if (status === "Rejected" && feedback) {
      onboarding.feedback = feedback; 
    }

    await onboarding.save();

    res.status(200).json({ message: "Status updated successfully", onboarding });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const getAllApprovedOnboardings = async (req: Request, res: Response) => {
  try {
    const onboardings = await OnboardingModel.find({ status: "Approved" });

    return res.status(200).json(onboardings);
  } catch (error) {
    console.error("Failed to fetch approved onboardings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};