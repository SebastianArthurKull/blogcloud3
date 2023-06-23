import mongoose from "mongoose";

export const connectMongoDB = async () => {
    if (mongoose.connection.readyState === 1) {
       return mongoose.connection.asPromise();
    }

    return await mongoose.connect("mongodb+srv://root:1234@cluster0.iu8md3t.mongodb.net/database?retryWrites=true&w=majority")
}