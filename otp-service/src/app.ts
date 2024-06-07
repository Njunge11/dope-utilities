import express, { Express } from "express";
import otpRoutes from "./api/routes/otp-routes";

const app: Express = express();

app.use(express.json());

app.use("/otp", otpRoutes);

export default app;
