import { Router } from "express";
import * as Controller from "./controller";

const paymentRouter = Router();

paymentRouter.route("/").get(Controller.list)
paymentRouter.route("/get-by-user").get(Controller.getByUserId)
paymentRouter.route("/delete").delete(Controller.destroy)

//Mercado-Pago
paymentRouter.route("/generate").post(Controller.generatePayment)

export default paymentRouter;