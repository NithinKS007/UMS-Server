import express from "express";
import dotenv from "dotenv";
import connectDB from "./infrastructure/database/mongoose";
import userRoute from "./presentation/routes/user.route";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/api/users",userRoute)


const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(`Failed to connect to DB${error}`));
