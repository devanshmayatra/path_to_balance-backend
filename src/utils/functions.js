import { EvaluationModel } from '../models/evaluationHistory.model.js';

const getAssements = async (users) =>
  Promise.all(users.map(async (user) => ({
    userId: user._id,
    assesments: await Promise.all(
      user.assesmentHistory.slice(0, 3).map(async ({ evaluationId }) =>
        EvaluationModel.findById(evaluationId).then(e => e?.evaluationSummary),
      )
    )
  })));

const getAssesmentsOfSingleUser = async (userId) => {
  const assesments = await EvaluationModel.find({
    userId
  });
  co
  return assesments;
}

const parseTaskJsonArray = (response) => {
  return response.map(res => {
    try {
      // Remove code block formatting and trim extra spaces
      const clean = res.replace(/```json/g, '').replace(/```/g, '').trim();

      // Parse to actual JSON
      return JSON.parse(clean);
    } catch (err) {
      console.error("Failed to parse JSON:", err.message);
      return null;
    }
  }).filter(Boolean); // remove any nulls from failed parsing
};

export {
  getAssements,
  getAssesmentsOfSingleUser,
  parseTaskJsonArray
};
