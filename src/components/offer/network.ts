import { Router } from "express";
import * as Controller from "./controller";

const offerRouter = Router();


offerRouter.route("/").get(Controller.list);

offerRouter.route("/:id").get(Controller.getById);

offerRouter.route("/").post(Controller.create);

offerRouter.route("/:id").put(Controller.update);

offerRouter.route("/:id").delete(Controller.destroy);

export default offerRouter;