import { Router } from "express";
import * as Controller from "./controller";

const productRouter = Router();


productRouter.route("/").get(Controller.list);

productRouter.route("/:id").get(Controller.getById);

productRouter.route("/").post(Controller.store);

productRouter.route("/:id").put(Controller.update);

productRouter.route("/:id").delete(Controller.destroy);

export default productRouter;
