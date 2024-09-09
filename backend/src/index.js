import app from "./app.js";
import dotenv from "dotenv";
import connectDb from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT, (err) => {
      console.log("app is listning on ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(`moongo connection failed ${error}`);
  });
