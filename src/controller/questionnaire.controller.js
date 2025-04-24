import { asyncHandler } from '../utils/asyncHandler.js'
import { Questionnaire } from '../models/questionnaire.model.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { FullQuestionnaire } from '../models/fullQuestionnaire.model.js';

const addQuestionnaire = asyncHandler(
  async (req, res) => {
    const { title } = req.body;

    const existingQuestionnaire = await Questionnaire.findOne({
      title
    });

    if (existingQuestionnaire) {
      throw new ApiError(400, 'Questionnaire already exists');
    }

    const questionnaire = new Questionnaire(
      {
        title
      }
    );
    await questionnaire.save();

    if (!questionnaire) {
      throw new ApiError(401, "Questionnaire not created");
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            questionnaire: questionnaire
          },
          "Questionnaire created Successfully"
        )
      )
  }
);

const getAllQuestionnaires = asyncHandler(
  async (req, res) => {
    const questionnaires = await FullQuestionnaire.find();
    // .populate('content');
    if (!questionnaires) {
      throw new ApiError(404, "Questionnaires not found");
    }

    const questionnairedata = questionnaires.map(questionnaire => (
      { id: questionnaire.id, title: questionnaire.title }
    ));

    // Define the desired order for suffixes
    const suffixOrder = {
      'I': 1,
      'II': 2
    };

    const questionnaireData = questionnairedata.slice().sort((a, b) => {
      const aSuffix = a.title.trim().split(' ').slice(-1)[0];
      const bSuffix = b.title.trim().split(' ').slice(-1)[0];

      const aOrder = suffixOrder[aSuffix] || 0;
      const bOrder = suffixOrder[bSuffix] || 0;

      return aOrder - bOrder;
    });

    return res.status(200)
      .json(
        new ApiResponse(
          200,
          {
            questionnaires: questionnaireData
          },
          "Questionnaires retrieved Successfully"
        )
      )
  }
)

const getOneQuestionnaire = asyncHandler(
  async (req, res) => {
    const questionnaireId = req.params.id;
    console.log(questionnaireId)

    // const questionnaire = await Questionnaire.findById(questionnaireId)

    const keywords = ["comprehensive", "healthy", "anxiety", "depression", "bipolar depression", "post-traumatic stress disorder (PTSD)", "schizophrenia", "eating disorders", "disruptive behaviour and dissocial disorders", "neurodevelopmental disorders"];

    const flag = keywords.includes(questionnaireId);

    console

    const questionnaire = flag ? await FullQuestionnaire.find({ title: { $regex: questionnaireId, $options: 'i' } }) : await FullQuestionnaire.findById(questionnaireId);
    // .populate('content');

    console.log(questionnaire)

    if (!questionnaire) {
      throw new ApiError(404, "Questionnaire not found");
    }

    return res.status(200)
      .json(
        new ApiResponse(
          200,
          {
            questionnaire: questionnaire
          },
          "Questionnaire retrieved Successfully"
        )
      )

  }
);

const getSpecificQuestionnaire = asyncHandler(
  async (req, res) => {
    const questionnaireId = req.params.id;
    // console.log(questionnaireId)

    const segregatedKeywords = questionnaireId.split("_");

    // const questionnaire = await Questionnaire.findById(questionnaireId)

    const keywords = ["comprehensive", "healthy", "anxiety", "depression", "bipolar depression", "post-traumatic stress disorder (PTSD)", "schizophrenia", "eating disorders", "oppositional defiant disorder screening", "neurodevelopmental disorders"];

    const flag = segregatedKeywords.some(keyword => keywords.includes(keyword));

    // console.log(flag)

    const questionnaire = flag
      ? await Promise.all(
        segregatedKeywords.map(async (id) => {
          console.log(id)
          return await FullQuestionnaire.find({
            title: { $regex: id, $options: 'i' }
          });
        })
      )
      : await FullQuestionnaire.findById(questionnaireId);

    // console.log(questionnaire)
    const questionnairedata = questionnaire.map(questionnaire => (
      { id: questionnaire.id, title: questionnaire.title }
    ));

    if (!questionnaire) {
      throw new ApiError(404, "Questionnaire not found");
    }

    return res.status(200)
      .json(
        new ApiResponse(
          200,
          {
            questionnaire: questionnairedata
          },
          "Questionnaire retrieved Successfully"
        )
      )
  }
)

const uploadFullQusstionnaire = asyncHandler(
  async (req, res) => {
    const body = req.body;
    const questionnaire = new FullQuestionnaire(body);
    await questionnaire.save();
    if (!questionnaire) {
      throw new ApiError(400, "Failed to save Questionnaire");
    };

    return res.status(200)
      .json(
        new ApiResponse(
          200,
          {
            questionnaire: questionnaire
          },
          "Questionnaire retrieved Successfully"
        )
      )
  }
);

// const getQuestionnaireByKeyword = asyncHandler(
//   async (req, res) => {
//     const { keyword } = req.body;
//     const questionnaires = await FullQuestionnaire.find({ title: { $regex: keyword, $options: 'i' } });
//     if (!questionnaires) {
//       throw new ApiError(400, "Failed to save Questionnaire");
//     };

//     return res.status(200)
//       .json(
//         new ApiResponse(
//           200,
//           {
//             questionnaire: questionnaires
//           },
//           "Questionnaire retrieved Successfully"
//         )
//       )
//   }
// )

export {
  addQuestionnaire,
  getOneQuestionnaire,
  getAllQuestionnaires,
  uploadFullQusstionnaire,
  getSpecificQuestionnaire
}