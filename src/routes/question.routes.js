import { Router } from "express";
import { addQuestion } from "../controller/question.controller.js";

const router = Router();

router.route("/add-question").post(
  addQuestion
);


export default router;