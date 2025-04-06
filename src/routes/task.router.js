import { Router } from "express";
import { taskGenerator , toggleTask } from "../controller/task.controller.js";
const router = Router();

router.route("/").get(
  taskGenerator
);

router.route("/toggle").post(
  toggleTask
);

export default router;