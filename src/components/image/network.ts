import { Router } from "express";
import * as Controller from "./controller";

const imageRouter = Router();

imageRouter.route("/").get(Controller.list);
imageRouter.route("/:productId").get(Controller.getbyProduct);
imageRouter.route("/").post(Controller.store);
imageRouter.route("/").put(Controller.update);
imageRouter.route("/:productId").delete(Controller.destroy);

export default imageRouter;
