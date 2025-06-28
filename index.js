import express from "express";
import dotenv from "dotenv";
import userroutes from "./routes/user.routes.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();
const app = express();
const PORT = process.env.PORT;
// middelewire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]


}))
// File upload service
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));


// DB connection
const DB_UR = process.env.MONGO_URI;
try {
  await mongoose.connect(DB_UR);
  console.log("Database connected successfully");
} catch (error) {
  console.log(error);
}
// Routing
app.use("/api/v1/user", userroutes);

// Cloudinary Configuration Code
    cloudinary.config({ 
      cloud_name: "dc0eskzxx" ,
      api_key: "645985342632788" ,  
      api_secret: "iu7MJQ6i5XHaX-yjn5-YodGakdg", 
  });
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
