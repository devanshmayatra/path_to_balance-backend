import cron from 'node-cron';
import { prompts } from './Prompts.js';
import { User } from '../models/user.model.js';
import { getAssements, getAssesmentsOfSingleUser, parseTaskJsonArray } from './functions.js';
import { GetResponseFromAi } from './GetResponseFromAi.js';
import { Task } from '../models/task.model.js';

const task = cron.schedule('0 0 * * 0', () => {
  console.log('Weekly task executed at:', new Date());
  generateWeeklyTask();
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata'
});

const generateWeeklyTask = async (userId = null) => {
  try {
    // Get assessments
    const users = userId ? await User.find({ _id: userId }) : await User.find();

    // Retrieve assessments for the fetched users
    const assessments = await getAssements(users);

    // Generate responses from AI
    const responses = await Promise.all(
      assessments.map(async (ass) => {
        const prompt = await prompts.taskPrompt(ass, "weekly");
        const response = await GetResponseFromAi(
          prompt,
          "You are Mental Health Support Bot Helping The User To Generate Task to Fix Their Issues"
        );
        return response;
      })
    );

    // Parse responses into task objects
    const tasks = parseTaskJsonArray(responses);

    // Save tasks to database
    const createdTasks = await Promise.all(
      tasks.map(async (task) => {
        const existingTaskDoc = await Task.findOne({ userId: task.userId });

        if (existingTaskDoc) {
          existingTaskDoc.weeklyTask.push(task.task);
          await existingTaskDoc.save();
          return existingTaskDoc;
        } else {
          return await Task.create({
            userId: task.userId,
            weeklyTask: [task.task],
            dailyTask: [],
          });
        }
      })
    );

    return createdTasks;
  } catch (error) {
    console.error("Error generating weekly tasks:", error);
    throw error;
  }
};


export {
  generateWeeklyTask
}