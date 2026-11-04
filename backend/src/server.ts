import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to SportNest API!",
  });
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`SportNest server running on port ${PORT}`);
});