import { Request, Response } from "express";
import { OnboardingModel } from "../models/onboardingModel"; // Adjust path

export const create = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      middleName,
      preferredName,
      email,
      ssn,
      dob,
      gender,
      address,
      contact,
      usResidentStatus,
      reference,
      emergencyContacts,
    } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const profilePic = files?.profilePic?.[0]?.path || undefined;
    const driverLicense = files?.driverLicense?.[0]?.path || undefined;
    const workAuth = files?.workAuth?.[0]?.path || undefined;

    const onboarding = new OnboardingModel({
      userId,
      firstName,
      lastName,
      middleName,
      preferredName,
      email,
      ssn,
      dob,
      gender,
      profilePic,
      address: address ? JSON.parse(address) : undefined,
      contact: contact ? JSON.parse(contact) : undefined,
      usResidentStatus: usResidentStatus
        ? JSON.parse(usResidentStatus)
        : undefined,
      reference: reference ? JSON.parse(reference) : undefined,
      emergencyContacts: emergencyContacts
        ? JSON.parse(emergencyContacts)
        : undefined,
      documents: {
        driverLicense,
        workAuth,
      },
      status: "Pending",
    });

    const saved = await onboarding.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Create onboarding error:", error);
    res.status(500).json({ message: "Failed to create onboarding record." });
  }
};

export const getOnboardingByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const onboarding = await OnboardingModel.findOne({ userId }).lean();

    if (!onboarding) {
      return res
        .status(404)
        .json({ message: "Onboarding not found for this user." });
    }

    res.json(onboarding);
  } catch (error) {
    console.error("Get onboarding error:", error);
    res.status(500).json({ message: "Failed to fetch onboarding data." });
  }
};

export const updateOnboardingByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const existing = await OnboardingModel.findOne({ userId });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Onboarding not found for this user." });
    }

    const {
      firstName,
      lastName,
      middleName,
      preferredName,
      email,
      ssn,
      dob,
      gender,
      address,
      contact,
      usResidentStatus,
      reference,
      emergencyContacts,
      feedback,
      status,
    } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const profilePic = files?.profilePic?.[0]?.path;
    const driverLicense = files?.driverLicense?.[0]?.path;
    const workAuth = files?.workAuth?.[0]?.path;

    if (firstName) existing.firstName = firstName;
    if (lastName) existing.lastName = lastName;
    if (middleName) existing.middleName = middleName;
    if (preferredName) existing.preferredName = preferredName;
    if (email) existing.email = email;
    if (ssn) existing.ssn = ssn;
    if (dob) existing.dob = dob;
    if (gender) existing.gender = gender;
    if (feedback) existing.feedback = feedback;
    if (status) existing.status = status as "Pending" | "Approved" | "Rejected";

    if (address) existing.address = JSON.parse(address);
    if (contact) existing.contact = JSON.parse(contact);
    if (usResidentStatus)
      existing.usResidentStatus = JSON.parse(usResidentStatus);
    if (reference) existing.reference = JSON.parse(reference);
    if (emergencyContacts)
      existing.emergencyContacts = JSON.parse(emergencyContacts);

    if (profilePic) existing.profilePic = profilePic;
    if (driverLicense || workAuth) {
      existing.documents = {
        ...existing.documents,
        ...(driverLicense && { driverLicense }),
        ...(workAuth && { workAuth }),
      };
    }

    const updated = await existing.save();
    res.json(updated);
  } catch (error) {
    console.error("Update onboarding error:", error);
    res.status(500).json({ message: "Failed to update onboarding." });
  }
};
