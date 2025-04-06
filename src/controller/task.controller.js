import { generateWeeklyTask } from '../utils/generateWeeklytask.js';
import { generateDailyTask } from '../utils/generateDailyTask.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Task } from '../models/task.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const taskGenerator = asyncHandler(
  async (req, res) => {
    const { userId } = req.body;
    const task = await Task.findOne({ userId });

    if (!task) {
      throw new ApiError('No task found', 404);
    };

    return res.status(201).json(
      new ApiResponse(200, task, "Tasks found succesfully")
    );
  }
);

export {
  taskGenerator
}