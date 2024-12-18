import express from "express";
import dotenv from "dotenv";
import connectDB from "./infrastructure/database/mongoose";
import userRoute from "./presentation/routes/user.route";
import adminRoute from "./presentation/routes/admin.route";
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config();
const app = express();

const allowedOrigins = process.env.CLIENT_ORIGINS;

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use("/api/users", userRoute);
app.use("/api/admins",adminRoute)

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(`Failed to connect to DB${error}`));
