import request from "supertest";
import express from "express";
import otpRoutes from "../../../api/routes/otp-route"; // Adjust the path as necessary
import { sendOtp, verifyOtp } from "../../../api/controllers/otp-controller"; // Adjust the path as necessary

jest.mock("../../../api/controllers/otp-controller", () => ({
  sendOtp: jest.fn((req, res) => res.status(200).send("OTP sent")),
  verifyOtp: jest.fn((req, res) => res.status(200).send("OTP verified")),
}));

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use("/otp", otpRoutes);

describe("OTP Routes", () => {
  it("should call sendOtp controller method", async () => {
    const response = await request(app)
      .post("/otp/send")
      .send({ phoneNumber: "1234567890" });

    expect(response.status).toBe(200);
    expect(response.text).toBe("OTP sent");
    expect(sendOtp).toHaveBeenCalledTimes(1);
  });

  it("should call verifyOtp controller method", async () => {
    const response = await request(app)
      .post("/otp/verify")
      .send({ phoneNumber: "1234567890", otp: "123456" });

    expect(response.status).toBe(200);
    expect(response.text).toBe("OTP verified");
    expect(verifyOtp).toHaveBeenCalledTimes(1);
  });
});
