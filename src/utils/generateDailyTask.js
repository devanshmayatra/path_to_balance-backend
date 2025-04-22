import cron from 'node-cron';
import { prompts } from './Prompts.js';
import { User } from '../models/user.model.js';
import { getAssements } from './functions.js';
import { GetResponseFromAi } from './GetResponseFromAi.js';
import { Task } from '../models/task.model.js';

const task = cron.schedule('0 0 * * *', () => {
  console.log('Cron job executed at:', new Date());
  generateDailyTask();
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata'
});

const generateDailyTask = async (userId = null) => {
  try {
    // Fetch users based on the presence of userId
    const users = userId ? await User.find({ _id: userId }) : await User.find();

    // Retrieve assessments for the fetched users
    const assessments = await getAssements(users);

    // Generate prompts and get AI responses
    const responses = await Promise.all(
      assessments.map(async (assessment) => {
        const prompt = await prompts.taskPrompt(assessment, "daily");
        const aiResponse = await GetResponseFromAi(
          prompt,
          "You are a Mental Health Support Bot helping the user to generate tasks to address their issues."
        );
        return aiResponse;
      })
    );

    // Parse AI responses into JSON
    const parseTaskJsonArray = (responses) => {
      return responses
        .map((res) => {
          try {
            const clean = res.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(clean);
          } catch (err) {
            console.error("Failed to parse JSON:", err.message);
            return null;
          }
        })
        .filter(Boolean); // Remove any nulls from failed parsing
    };

    const tasks = parseTaskJsonArray(responses);

    // Create or update tasks in the database
    const createdTasks = await Promise.all(
      tasks.map(async (task) => {
        const existingTaskDoc = await Task.findOne({ userId: task.userId });

        if (existingTaskDoc) {
          existingTaskDoc.dailyTask.push(task.task);
          await existingTaskDoc.save();
          return existingTaskDoc;
        } else {
          const newTaskDoc = await Task.create({
            userId: task.userId,
            weeklyTask: [],
            dailyTask: [task.task],
          });
          return newTaskDoc;
        }
      })
    );
  } catch (error) {
    console.error("Error in generateDailyTask:", error);
    throw error;
  }
};


export {
  generateDailyTask
}