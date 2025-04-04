import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const goToAiResponse = asyncHandler(
  async (req, res) => {
    const { evaluationScore } = req.body;
    console.log(evaluationScore);

    const prompt = {
      data: evaluationScore,

    }

    return res.status(200)
      .json(
        new ApiResponse(
          200,
          {
            questionnaire: questionnaire
          },
          "Work in progress"
        )
      )
  }
);

export {
  goToAiResponse,
}