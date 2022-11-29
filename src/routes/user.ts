import { Router } from "express";
import { user } from "../controllers";
import { authGestor, authorization } from "../middlewares";

const routes = Router();

routes.post("/password", user.updatePassword);
routes.post("/", authGestor, user.create);
routes.put("/", authGestor, user.update);
routes.delete("/", authGestor, user.delete);
routes.get("/:profile/:department", user.list);

export default routes;
