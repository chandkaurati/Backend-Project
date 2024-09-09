import mongoose from "mongoose";
import { db_name } from "../constants.js";
import app from "../app.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${db_name}`
    );
    app.on("error", (err) => {
      console.log(`Express side Error ${err}`);
    });

    console.log(
      `Mongo connected succefully !! DB HOST ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`MongoDB connection failed ${error}`);
    process.exit(1);
  }
};

export default connectDb;
