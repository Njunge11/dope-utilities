import { Request, Response } from "express";
import { sendOtp, verifyOtp } from "../../../api/controllers/otp-controller";
import { processOtp, validateOtp } from "../../../api/services/otp-service";
import { mock } from "node:test";

jest.mock("../../../api/services/otp-service");

describe("OTP Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockResponse: any;
  describe("sendOto", () => {
    beforeEach(() => {
      req = { body: { mobileNumber: "1234567890" } };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      mockResponse = { status: 200, message: "OTP sent successfully" };
      (processOtp as jest.Mock).mockResolvedValue(mockResponse);
    });
    it("should send OTP and return response", async () => {
      await sendOtp(req as Request, res as Response);
      expect(processOtp).toHaveBeenCalledWith("1234567890");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockResponse);
    });

    describe("verifyOtp", () => {
      beforeEach(() => {
        req = { body: { mobileNumber: "1234567890", otp: "123456" } };
        res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };
        mockResponse = { status: 200, message: "OTP verified successfully" };
        (validateOtp as jest.Mock).mockResolvedValue(mockResponse);
      });
      it("should verify OTP and return response", async () => {
        await verifyOtp(req as Request, res as Response);
        expect(validateOtp).toHaveBeenLastCalledWith("1234567890", "123456");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(mockResponse);
      });
    });
  });
});
