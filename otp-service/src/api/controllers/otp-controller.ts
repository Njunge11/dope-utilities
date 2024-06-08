import { Request, Response } from "express";
import { processOtp, validateOtp } from "../services/otp-service";

export const sendOtp = async (req: Request, res: Response) => {
  const { mobileNumber } = req.body;
  const response = await processOtp(mobileNumber);
  res.status(response.status).send(response);
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { mobileNumber, otp } = req.body;
  const response = await validateOtp(mobileNumber, otp);
  res.status(response.status).send(response);
};
