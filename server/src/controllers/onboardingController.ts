import { Request, Response } from "express";
import { OnboardingModel } from "../models/onboardingModel";

function tryParse(input: any) {
  if (typeof input !== "string") return input;
  try {
    return JSON.parse(input);
  } catch (e) {
    console.error("Failed to parse:", input);
    return undefined;
  }
}

export const create = async (req: Request, res: Response) => {
  console.log("req.files:", req.files);
  console.log("req.body:", req.body);
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

    const optReceipt = files?.optReceipt?.[0].path;
    const profilePic = files?.profilePic?.[0].path;
    const driverLicense = files?.driverLicense?.[0].path;
    const workAuth = files?.workAuth?.[0].path;

    console.log("Parsed address:", tryParse(address));
    console.log("Parsed contact:", tryParse(contact));
    console.log("Parsed usResidentStatus:", tryParse(usResidentStatus));
    console.log("Parsed reference:", tryParse(reference));
    console.log("Parsed emergencyContacts:", tryParse(emergencyContacts));

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
      address: tryParse(address),
      contact: tryParse(contact),
      usResidentStatus: usResidentStatus
        ? { ...tryParse(usResidentStatus), optReceipt }
        : undefined,
      reference: tryParse(reference),
      emergencyContacts: tryParse(emergencyContacts),
      documents: {
        driverLicense,
        workAuth,
      },
      status: "Pending",
    });

    const saved = await onboarding.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(
      "Create onboarding error:",
      error instanceof Error ? error.stack : error
    );
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
    } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const optReceipt = files?.optReceipt?.[0]?.path;
    const profilePic = files?.profilePic?.[0]?.path;
    const driverLicense = files?.driverLicense?.[0]?.path;
    const workAuth = files?.workAuth?.[0]?.path;

    console.log("Parsed address:", tryParse(address));
    console.log("Parsed contact:", tryParse(contact));
    console.log("Parsed usResidentStatus:", tryParse(usResidentStatus));
    console.log("Parsed reference:", tryParse(reference));
    console.log("Parsed emergencyContacts:", tryParse(emergencyContacts));

    if (firstName) existing.firstName = firstName;
    if (lastName) existing.lastName = lastName;
    if (middleName) existing.middleName = middleName;
    if (preferredName) existing.preferredName = preferredName;
    if (email) existing.email = email;
    if (ssn) existing.ssn = ssn;
    if (dob) existing.dob = dob;
    if (gender) existing.gender = gender;
    if (feedback) existing.feedback = feedback;

    if (profilePic) existing.profilePic = profilePic;

    if (address) existing.address = tryParse(address);
    if (contact) existing.contact = tryParse(contact);

    if (usResidentStatus) {
      const parsedStatus = tryParse(usResidentStatus);
      if (optReceipt) parsedStatus.optReceipt = optReceipt;
      existing.usResidentStatus = parsedStatus;
    }

    if (reference) existing.reference = tryParse(reference);
    if (emergencyContacts)
      existing.emergencyContacts = tryParse(emergencyContacts);

    if (driverLicense || workAuth) {
      existing.documents = {
        ...existing.documents,
        ...(driverLicense && { driverLicense }),
        ...(workAuth && { workAuth }),
      };
    }

    if (existing.status === "Rejected") {
      existing.status = "Pending";
    }

    const updated = await existing.save();
    res.json(updated);
  } catch (error) {
    console.error(
      "Update onboarding error:",
      error instanceof Error ? error.stack : error
    );
    res.status(500).json({ message: "Failed to update onboarding." });
  }
};
