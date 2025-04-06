import { Router } from "express";
import { taskGenerator } from "../controller/task.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.model.js";

const router = Router();

router.route("/").get(
  taskGenerator
);

// router.route("/create").post(
//   asyncHandler(
//     async (req, res) => {
//       const {userId} = req.body;
//       const task = new Task({userId});
//       await task.save();
//       console.log(task);
//     }
//   )
// );


export default router;