import crypto, { createHash } from "crypto";
import { getRedisClient } from "../../utils/redis-client";
import { successResponse, errorResponse } from "../../utils/api-responses";

const generateOtp = (otpLength = 4) => {
  const maximum = parseInt("9".repeat(otpLength), 10);
  const minimum = parseInt("1" + "0".repeat(otpLength - 1), 10);
  const otp = crypto.randomInt(minimum, maximum + 1);
  return otp.toString();
};

const hashOtp = (otp: string) => {
  const hash = createHash("sha256");
  hash.update(otp);
  return hash.digest("hex");
};

const storeOtp = async (otp: string, mobileNumber: string) => {
  try {
    const client = await getRedisClient();
    const otpExists = await getOtp(mobileNumber);
    if (otpExists) {
      await removeOtp(client, mobileNumber);
    }
    const result = await client.hSet(mobileNumber, {
      otp,
    });
    await client.expire(mobileNumber, 60);
    return result > 0;
  } catch (error) {
    console.error("Error storing otp in redis", error);
    return false;
  }
};

const sendOtp = (otp: string) => {
  console.log("Time to send otp");
};

export const processOtp = async (mobileNumber: string) => {
  const otp = generateOtp();
  const hashedOtp = hashOtp(otp);
  console.log(otp);
  const result = await storeOtp(hashedOtp, mobileNumber);
  if (result) {
    console.log("time to send message to queue");
    return successResponse(200, "OTP Sent successfully");
  } else {
    return errorResponse(
      "",
      "Sending OTP Failed",
      400,
      "OTP was not sent. Please try again."
    );
  }
};

const getOtp = async (mobileNumber: string) => {
  return await getRedisClient().hGet(mobileNumber, "otp");
};

const removeOtp = async (client: any, mobileNumber: string) => {
  try {
    return await client.del(mobileNumber);
  } catch (error) {
    console.error("Error removing OTP record", error);
  }
};

const handleOTPResult = async (
  result: string,
  hashedOtp: string,
  mobileNumber: string
) => {
  if (result === hashedOtp) {
    const client = getRedisClient();
    await removeOtp(client, mobileNumber);
    return successResponse(200, "OTP Verification is Successful.");
  } else {
    return errorResponse("", "Invalid OTP.", 400, "OTP Provided is invalid.");
  }
};

export const validateOtp = async (mobileNumber: string, otp: string) => {
  const hashedOtp = hashOtp(otp);
  const result = await getOtp(mobileNumber);
  if (result) {
    return await handleOTPResult(result, hashedOtp, mobileNumber);
  } else {
    return errorResponse(
      "",
      "Invalid OTP.",
      400,
      "OTP not found for provided mobile number or the OTP has expired."
    );
  }
};
