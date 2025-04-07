import { Router } from "express";
import { taskGenerator, toggleTask, assigntasks } from "../controller/task.controller.js";
const router = Router();

router.route("/:id").get(
  taskGenerator
);

router.route("/toggle").post(
  toggleTask
);

// router.route("/assign").post(
//   assigntasks
// );

export default router;