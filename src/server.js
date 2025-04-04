import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { app } from './app.js';

dotenv.config({ path : './.env' });

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000 , ()=>{
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
  })
  app.on('error',(error)=>{
    throw error;
  })
})
.catch((error)=>{
  console.error(`MongoDB Connection Failed ${error}`);
})