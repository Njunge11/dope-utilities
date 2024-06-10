export const sendOtp = jest.fn((req, res) => res.status(200).send("OTP sent"));
export const verifyOtp = jest.fn((req, res) =>
  res.status(200).send("OTP verified")
);
