import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { GoogleGenAI } from "@google/genai";
import { User } from '../models/user.model.js'
import { FullQuestionnaire } from '../models/fullQuestionnaire.model.js'
import { EvaluationModel } from "../models/evaluationHistory.model.js";

const goToAiResponse = asyncHandler(
  async (req, res) => {
    const { userID, questionnaireID, evaluationScore } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const prompt = `You are a mental health analysis engine.
    
    Given the following evaluation score data:
    ${JSON.stringify(promptData, null, 2)}
    
    Analyze the user's mental health state based on the data. Output your response in the following strict JSON format:
    
    {
      "sentiment": "positive | neutral | negative",
      "risk_level": "low | moderate | high",
      "summary": "Short summary of your reasoning",
      "suggestions": ["One sentence actionable suggestion", "Another suggestion if needed"]
    }
    
    Only respond with the JSON output. Do not include any extra explanation or text.
    Only recommend a mental health professional if and only if necessary
    `

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    function parseEscapedJson(escapedStr) {
      try {
        const cleanedStr = escapedStr.replace(/^```json\n/, '').replace(/\n```$/, '');

        const unescaped = cleanedStr.trim().replace(/\\n/g, '').replace(/\\"/g, '"');

        return JSON.parse(unescaped);
      } catch (error) {
        console.error("Failed to parse JSON:", error.message);
        return null;
      }
    };

    const sentiment = parseEscapedJson(response.text);

    const evaluation = new EvaluationModel({
      userID,
      questioannaireID: questionnaireID,
      evaluationSummary: sentiment
    });
    evaluation.save();

    const assesmentHistory = user.assesmentHistory;

    assesmentHistory.push({
      questionnaireId: questionnaire._id,
      evaluationId: evaluation._id
    })

    console.log("90",assesmentHistory);

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
            sentiment: updatedUser
          },
          "Ai analysis done"
        )
      )
  }
);

export {
  goToAiResponse,
}