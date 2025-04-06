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

export {
  getAssements
};
