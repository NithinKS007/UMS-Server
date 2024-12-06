import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./infrastructure/database/mongoose";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.get("/api/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from the server!" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(`Failed to connect to DB${error}`));
