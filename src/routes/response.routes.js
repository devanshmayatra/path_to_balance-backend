import { Router } from "express";
import { goToAiResponse, getEvaluation } from "../controller/response.controller.js";

const router = Router();

router.route("/").post(
  goToAiResponse,
)

router.route("/get-evaluation").get(
  getEvaluation,
)

export default router;