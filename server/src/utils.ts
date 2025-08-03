import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUserJWT } from "./types";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from 'multer'

// generate JWT token
export const generateToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET || "jwtsecret";
  return jwt.sign(payload, secret, { expiresIn: "3h" });
};

// auth middleware
export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token found" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "jwtsecret";

  try {
    const decoded = jwt.verify(token, secret) as IUserJWT;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// permit middleware
export const permit = (...allowedRoles: ("HR" | "EMPLOYEE")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

// send email
export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};


// cloudinary storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'employee_uploads',
    resource_type: file.mimetype.startsWith('image/') ? 'image' : 'auto',
    public_id: `${Date.now()}-&{file.originalname}`,
  }),
});

export const upload = multer({ storage })
export { cloudinary }

