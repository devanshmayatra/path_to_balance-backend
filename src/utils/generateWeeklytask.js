import cron from 'node-cron';
import { prompts } from './Prompts.js';
import { User } from '../models/user.model.js';
import { getAssements } from './functions.js';
import { GetResponseFromAi } from './GetResponseFromAi.js';
import { Task } from '../models/task.model.js';

const task = cron.schedule('0 0 * * 0', () => {
  console.log('Weekly task executed at:', new Date());
  generateWeeklyTask();
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata'
});

const generateWeeklyTask = async () => {

  const users = await User.find();
  const assesments = await getAssements(users);
  const response = await Promise.all(
    assesments.map(async ass => {
      const prompt = await prompts.taskPrompt(ass, "weekly");
      const response = await GetResponseFromAi(
        prompt,
        "You are Mental Health Support Bot Helping The User To Generate Task to Fix Their Issues"
      );
      return response;
    })
  );

  function parseTaskJsonArray(response) {
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

  const tasks = parseTaskJsonArray(response);

  const createdTasks = await Promise.all(
    tasks.map(async (task) => {
      // Find the Task document for the user
      const existingTaskDoc = await Task.findOne({ userId: task.userId });

      if (existingTaskDoc) {
        // Push the new task to the weeklyTask array
        existingTaskDoc.weeklyTask.push(task.task);
        await existingTaskDoc.save();
        return existingTaskDoc;
      } else {
        // If not found, optionally create a new Task document
        const newTaskDoc = await Task.create({
          userId: task.userId,
          weeklyTask: [task.task],
          dailyTask: []
        });
        return newTaskDoc;
      }
    })
  );
};

export {
  generateWeeklyTask
}