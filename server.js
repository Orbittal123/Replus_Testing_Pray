import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Routes from "./routes/route.js";
import cookieParser from "cookie-parser";
import path from 'path';

const app = express();
dotenv.config();

app.use(bodyParser.json({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join('images')));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use("/api", Routes);
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log("Listening on port", PORT)); // Fixed the log message

 