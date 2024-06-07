import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otp-controller";

const router = express.Router();

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);

export default router;
