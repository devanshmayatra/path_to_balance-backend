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

const toggleTask = asyncHandler(
  async (req, res) => {
    const { userId, taskId } = req.body;
    const task = await Task.findOne({
      userId
    });
    if (!task) {
      throw new ApiError('No task found', 404);
    };

    let toggled = false;

    task.dailyTask.forEach((t) => {
      if (!toggled && String(t._id) === String(taskId)) {
        t.status = !t.status;
        toggled = true;
      }
    });

    task.weeklyTask.forEach((t) => {
      if (!toggled && String(t._id) === String(taskId)) {
        t.status = !t.status;
        toggled = true;
      }
    });

    const newTask = await Task.findOneAndUpdate({ userId }, task, {
      new: true
    });

    return res.status(200).json(
      new ApiResponse(200, newTask, "Tasks updated succesfully")
    );
  }
)

export {
  taskGenerator,
  toggleTask
}