import {
  generateOtp,
  hashOtp,
  getOtp,
  removeOtp,
  storeOtp,
} from "../../../api/services/otp-service";
import { createHash } from "crypto";
import { getRedisClient } from "../../../utils/redis-client";

// Mocking the `crypto` module
jest.mock("crypto", () => {
  const originalModule = jest.requireActual("crypto");
  return {
    ...originalModule,
    createHash: jest.fn().mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue("mockedhash"),
    }),
  };
});

// Mocking the `redis-client` module
jest.mock("../../../utils/redis-client", () => ({
  getRedisClient: jest.fn(),
}));

describe("generateOtp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

describe("hashOtp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the correct hash for a given OTP", () => {
    const otp = "123456";
    const expectedHash = "mockedhash";

    const result = hashOtp(otp);

    expect(result).toBe(expectedHash);
  });

  it("should call createHash with sha256", () => {
    const otp = "123456";

    hashOtp(otp);

    expect(createHash).toHaveBeenCalledWith("sha256");
  });

  it("should update the hash with the provided OTP", () => {
    const otp = "123456";
    const mockHash = createHash("sha256");

    hashOtp(otp);

    expect(mockHash.update).toHaveBeenCalledWith(otp);
  });

  it("should return a hexadecimal digest", () => {
    const otp = "123456";
    const mockHash = createHash("sha256");

    const result = hashOtp(otp);

    expect(mockHash.digest).toHaveBeenCalledWith("hex");
    expect(result).toBe("mockedhash");
  });
});

describe("getOtp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the OTP for a given mobile number", async () => {
    const mockOtp = "123456";
    const mockMobileNumber = "1234567890";
    const mockHGet = jest.fn().mockResolvedValue(mockOtp);
    (getRedisClient as jest.Mock).mockReturnValue({ hGet: mockHGet });

    const result = await getOtp(mockMobileNumber);

    expect(result).toBe(mockOtp);
    expect(getRedisClient).toHaveBeenCalled();
    expect(mockHGet).toHaveBeenCalledWith(mockMobileNumber, "otp");
  });

  it("should return null if no OTP is found", async () => {
    const mockMobileNumber = "1234567890";
    const mockHGet = jest.fn().mockResolvedValue(null);
    (getRedisClient as jest.Mock).mockReturnValue({ hGet: mockHGet });

    const result = await getOtp(mockMobileNumber);

    expect(result).toBeNull();
    expect(getRedisClient).toHaveBeenCalled();
    expect(mockHGet).toHaveBeenCalledWith(mockMobileNumber, "otp");
  });
});

describe("removeOtp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should remove the OTP for a given mobile number", async () => {
    const mockMobileNumber = "1234567890";
    const mockDel = jest.fn().mockResolvedValue(1);
    const mockClient = { del: mockDel };

    const result = await removeOtp(mockClient, mockMobileNumber);

    expect(result).toBe(1);
    expect(mockDel).toHaveBeenCalledWith(mockMobileNumber);
  });

  it("should handle errors gracefully", async () => {
    const mockMobileNumber = "1234567890";
    const mockError = new Error("Del error");
    const mockDel = jest.fn().mockRejectedValue(mockError);
    const mockClient = { del: mockDel };

    await expect(
      removeOtp(mockClient, mockMobileNumber)
    ).resolves.toBeUndefined();
    expect(mockDel).toHaveBeenCalledWith(mockMobileNumber);
  });
});
