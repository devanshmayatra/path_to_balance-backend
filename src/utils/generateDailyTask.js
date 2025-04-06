import cron from 'node-cron';
import { prompts } from './Prompts.js';
import { User } from '../models/user.model.js';
import { getAssements } from './functions.js';
import { GetResponseFromAi } from './GetResponseFromAi.js';
import { Task } from '../models/task.model.js';

cron.schedule("0 0 * * *", () => generateTasks("daily")); // Every day at midnight

const generateDailyTask = async () => {

  const users = await User.find();
  const assesments = await getAssements(users);
  const response = await Promise.all(
    assesments.map(async ass => {
      const prompt = await prompts.taskPrompt(ass , "daily");
      const response = await GetResponseFromAi(
        prompt,
        "You are Mental Health Support Bot Helping The User To Generate Task to Fix Their Issues"
      );
      return response;
    })
  );

  const cleanData = response.map(res => res
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()
  );

  const tasks = cleanData.map(res => JSON.parse(res));

  const createdTasks = await Promise.all(
    tasks.map(async (task) => {
      // Find the Task document for the user
      const existingTaskDoc = await Task.findOne({ userId: task.userId });

      if (existingTaskDoc) {
        // Push the new task to the weeklyTask array
        existingTaskDoc.dailyTask.push(task.task);
        await existingTaskDoc.save();
        return existingTaskDoc;
      } else {
        // If not found, optionally create a new Task document
        const newTaskDoc = await Task.create({
          userId: task.userId,
          weeklyTask: [],
          dailyTask: [task.task]
        });
        return newTaskDoc;
      }
    })
  );
};

export {
  generateDailyTask
}