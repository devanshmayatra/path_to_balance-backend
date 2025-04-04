import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    console.log(`Server running on http://localhost:${process.env.PORT} \nhost- ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(`MONGODB Connection error : ${error}`);
    process.exit(1);
  }
}

export default connectDB;