import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import userrouter from "./routes/user.router.js";
const app = express();

app.use(cors());
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);


app.use(express.static("public"));

app.use(cookieparser());

app.use("/api/v2/users", userrouter);

export default app;
