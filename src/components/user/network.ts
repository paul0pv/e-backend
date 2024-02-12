import { Router } from "express";
import * as Controller from "./controller";

const userRouter = Router();

// LOG-IN
userRouter.route("/login").post(Controller.login);
// SIGN-UP
userRouter.route("/signup").post(Controller.signUp);
// AVAILABLE-EMAIL
userRouter.route("/check-if-available-email").post(Controller.checkIfAvailableEmail);
// VERIFY-EMAIL
userRouter.route("/get-by-email").post(Controller.getByEmail);


// USERS
userRouter.route("/").get(Controller.list);
// USER BY ID
userRouter.route("/:id").get(Controller.getById);
// UPDATE USER
userRouter.route("/:id").put(Controller.update);
// DELETE USER
userRouter.route("/:id").delete(Controller.destroy);

export default userRouter;
