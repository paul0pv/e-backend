import { Router } from "express";
import * as Controller from "./controller";

const employeeRouter = Router();

// LOG-IN
employeeRouter.route("/login").post(Controller.login);
// SIGN-UP
employeeRouter.route("/signup").post(Controller.signup);
// AVAILABLE-EMAIL
employeeRouter.route("/check-if-available-email").post(Controller.checkIfAvailableEmail);
// VERIFY-EMAIL
employeeRouter.route("/get-by-email").post(Controller.getByEmail);


// READ EMPLOYEES
employeeRouter.route("/").get(Controller.list);
// EMPLOYEE BY ID
employeeRouter.route("/:id").get(Controller.getById);
// UPDATE EMPLOYEE
employeeRouter.route("/:id").put(Controller.update);
// DELETE EMPLOYEE
employeeRouter.route("/:id").delete(Controller.destroy);

export default employeeRouter;