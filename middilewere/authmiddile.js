import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  // Get the token from the request headers
   const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.Id= await User.findById(decoded._id)
    req.userId=decoded._id

    //  console.log(decoded);
  } catch (error) {
    return res.status(500).json({
      message: "middleware error",
      error: error.message,
    });
  }

  next();
};
