import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from '../models/user.model.js'
import { FullQuestionnaire } from '../models/fullQuestionnaire.model.js'
import { EvaluationModel } from "../models/evaluationHistory.model.js";
import { GetResponseFromAi } from "../utils/GetResponseFromAi.js";
import { prompts } from "../utils/Prompts.js";

const goToAiResponse = asyncHandler(
  async (req, res) => {
    const { userID, questionnaireID, evaluationScore } = req.body;

    const user = await User.findById(userID);
    const questionnaire = await FullQuestionnaire.findById(questionnaireID);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!questionnaire) {
      throw new ApiError(404, "Questionnaire not found");
    }

    const options = {
      0: "Not at all",
      1: "Several days",
      2: "More than half the days",
      3: "Nearly everyday"
    };

    const promptData = evaluationScore.map(score => {
      return {
        question: score.question,
        answer: options[score.answer]
      };
    });

    const prompt = await prompts.mentalhealthEvaluationPrompt(promptData);

    const response = await GetResponseFromAi(prompt, "Mental Health Analysis Engine");

    async function parseEscapedJson(escapedStr) {
      try {
        const cleanedStr = escapedStr.replace(/^```json\n/, '').replace(/\n```$/, '');

        const unescaped = cleanedStr.trim().replace(/\\n/g, '').replace(/\\"/g, '"');

        return JSON.parse(unescaped);
      } catch (error) {
        console.error("Failed to parse JSON:", error.message);
        return null;
      }
    };

    const sentiment = await parseEscapedJson(response);

    const evaluation = new EvaluationModel({
      userID,
      questioannaireID: questionnaireID,
      evaluationSummary: sentiment
    });
    await evaluation.save();

    const assesmentHistory = user.assesmentHistory;

    assesmentHistory.push({
      questionnaireTitle:questionnaire.title,
      questionnaireId: questionnaire._id,
      assesmentScore:evaluation.evaluationSummary.assesmentScore,
      evaluationId: evaluation._id
    });

    const updatedUser = await User.findByIdAndUpdate({
      _id: userID,
    }, {
      $set: {
        recentAssesment: evaluation.evaluationSummary,
        assesmentHistory: assesmentHistory
      },
    }, {
      new: true,
      upsert: false
    })

    return res.status(200)
      .json(
        new ApiResponse(
          200,
          {
            sentiment: evaluation
          },
          "Ai analysis done"
        )
      )
  }
);

const getEvaluation = asyncHandler(
  async (req, res) => {
    const evaluationId = req.params.evaluationId;

    const evaluation = await EvaluationModel.findById(evaluationId);
    if (!evaluation) {
      throw new ApiError('No evaluation found', 404);
    }

    return res.status(200)
      .json(
        new ApiResponse(
          200,
          {
            evaluation: evaluation
          },
          "Evaluation fetched succesfully."
        )
      );
  }
)

export {
  goToAiResponse,
  getEvaluation
}