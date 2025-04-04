import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Question } from "../models/question.model.js";
import { Questionnaire } from "../models/questionnaire.model.js";

const addQuestion = asyncHandler(
  async (req, res, next) => {
    const { questionnaireId, question, optionOne, optionTwo, optionThree, optionFour } = await req.body;
    let object = {}
    if (optionOne) {
      object = {
        question,
        options: {
          optionOne,
          optionTwo,
          optionThree,
          optionFour
        }
      }
    } else {
      object = {
        question
      }
    };

    const newQuestion = await Question.create(object);
    // await newQuestion.save();

    if (!newQuestion) {
      throw new ApiError(404, "Question not created")
    };

    const questionnaire = await Questionnaire.findByIdAndUpdate(questionnaireId, {
      $push: { content: newQuestion._id }
    }, {
      new: true
    });
    if (!questionnaire) {
      throw new ApiError(404, "Questionnaire not found")
    };

    console.log(questionnaire)

    return res.status(200)
      .json(
        new ApiResponse(
          200,
          {
            question: newQuestion
          },
          "Question Creatted Succesfully"
        )
      )
  }
)

export {
  addQuestion
}