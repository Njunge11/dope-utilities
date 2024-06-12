import request from "supertest";
import app from "../../app";

describe("App Initialization", () => {
  it("should have the /otp route", async () => {
    const response = await request(app)
      .post("/otp/send")
      .send({ mobileNumber: "1234567890" });
    expect(response.status).not.toBe(404);
  });
});
