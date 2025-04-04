import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const goToAiResponse = asyncHandler(
  async (req, res) => {
    const { evaluationScore } = req.body;
    console.log(evaluationScore);

    const prompt = {
      data:evaluationScore,
      
    }
  }
);

export {
  goToAiResponse,
}