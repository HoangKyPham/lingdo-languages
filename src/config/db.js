import mongoose from "mongoose";

export const connectDB = async (uri) => {
    console.log(uri);
    try {
        await mongoose.connect(uri);
        console.log("Connected to db");
    } catch (error) {
        console.log(error);
    }
};