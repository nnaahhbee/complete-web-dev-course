import mongoose from "mongoose";

export async function connectToDB() {
    try{
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("Connected to the MongoDB database");
        });

        connection.on('error', (err) => {
            console.log("Error connecting to the MongoDB database:", + err);
            process.exit();
        });

    }catch(error){
        console.log("Error connecting to the MongoDB database:", error);
        console.log(error);

    }
}