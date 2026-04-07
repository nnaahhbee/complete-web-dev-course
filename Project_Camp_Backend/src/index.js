import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/db_conn.js";

dotenv.config({
  path: "./.env",
});


const port = process.env.PORT || 3000;


connectDB()
.then(() => {
  app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
});
})
.catch((err) => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);
});





