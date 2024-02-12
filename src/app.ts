import cors from "cors";
import express, {type Application} from "express";
import {
  employeeRouter,
  productRouter,
  userRouter,
  imageRouter,
  paymentRouter,
  categoryRouter,
  offerRouter,
} from "./components";
import { apiVersion } from "./config";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(`${apiVersion}/employees`, employeeRouter);
app.use(`${apiVersion}/users`, userRouter);
app.use(`${apiVersion}/products`, productRouter);
app.use(`${apiVersion}/images`, imageRouter);
app.use(`${apiVersion}/payments`, paymentRouter);
app.use(`${apiVersion}/categories`, categoryRouter);
app.use(`${apiVersion}/offers`, offerRouter);

export default app;