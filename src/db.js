import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://brunosaid:asda@cluster0.erjdh.mongodb.net/cufadb?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("DB is connected");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
