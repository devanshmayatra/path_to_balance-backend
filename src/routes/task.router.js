import { Router } from "express";
import { taskGenerator , toggleTask } from "../controller/task.controller.js";
const router = Router();

router.route("/:id").get(
  taskGenerator
);

router.route("/toggle").post(
  toggleTask
);

export default router;