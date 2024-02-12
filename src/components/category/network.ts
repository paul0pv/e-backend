import { Router } from "express";
import * as Controller from "./controller";

const categoryRouter = Router();


categoryRouter.route("/").get(Controller.list);

categoryRouter.route("/:id").get(Controller.getById);

categoryRouter.route("/").post(Controller.create);

categoryRouter.route("/:id").put(Controller.update);

categoryRouter.route("/:id").delete(Controller.destroy);

export default categoryRouter;