import { generateOtp } from "../../../api/services/otp-service";

describe("generateOtp", () => {
  it("should return a string", () => {
    const otp = generateOtp();
    expect(typeof otp).toBe("string");
  });

  it("should return an OTP of the correct length", () => {
    const otpLength = 6;
    const otp = generateOtp(otpLength);
    expect(otp.length).toBe(otpLength);
  });

  it("should return an OTP within the expected range", () => {
    const otpLength = 6;
    const otp = generateOtp(otpLength);
    const maximum = parseInt("9".repeat(otpLength), 10);
    const minimum = parseInt("1" + "0".repeat(otpLength - 1), 10);

    const otpNumber = parseInt(otp, 10);
    expect(otpNumber).toBeGreaterThanOrEqual(minimum);
    expect(otpNumber).toBeLessThanOrEqual(maximum);
  });

  it("should return an OTP of default length 4 when no argument is passed", () => {
    const otp = generateOtp();
    expect(otp.length).toBe(4);
  });
});
