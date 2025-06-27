import { User } from "../Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary';

// register
export const register = async (req, res) => {
  const { username, email, password, roll, classname, semester, branch, phone, address } = req.body;
  try {
    // Validation
    if (!username || !email || !password || !roll || !classname || !semester || !branch || !phone || !address) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    // cloudinary image upload
    const { image } = req.files;
    if (!image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }
    // Allow formate
  const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Invalid file format. Only PNG and JPG are allowed" });
    }
     // Upload image to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file to cloudinary" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    // Hash password
    const hashpassword = await bcrypt.hash(password, 10);
    const newuser = new User({
      username,
      email,
      password: hashpassword,
      roll,
      classname,
      semester,
      branch,
      phone,
      address,
     image:{
        publicId: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url
     }
    });
    // Save user to database
    const user = await newuser.save();
    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in registration",
    });
  }
};
// login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //   validation
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    //    compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid login credentials",
      });
    }
    //   Generate JWT token
    const token = await jwt.sign({
      _id: user.id,
    },process.env.JWT_SECRET,{
        expiresIn: "1d"
    });
// store token in cookie
res.cookie("token", token);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        email,
        password: user.password,
       
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in login",
    });
  }
};
// get user data
export const getUserData = async (req, res) => {
  const {Id}=req.params;
  try {
    const userdata = await User.findById(Id);
    if (!userdata) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      userdata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in fetching user data",
    });
  }
};