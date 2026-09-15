import mongoose from "mongoose";

// Beginner note:
// This file connects the app to MongoDB. We call this function before
// doing any database work in our API routes, so the app knows where to save
// and read user data.
export async function connect() {
    try{
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        // When MongoDB connects successfully, this event runs.
        connection.on('connected', () => {
            console.log("Connected to the MongoDB database");
        });

        // If MongoDB has a problem, we log the error and stop the app.
        connection.on('error', (err) => {
            console.log("Error connecting to the MongoDB database:", + err);
            process.exit();
        });

    }catch(error){
        console.log("Error connecting to the MongoDB database:", error);
        console.log(error);

    }
}