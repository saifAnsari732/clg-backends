import { User } from "../Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { Attendance } from "../Models/attendence.js";
import nodemailer from "nodemailer";
import { text } from "express";

// emailcongic
const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ansarisaifuddin732@gmail.com",
    pass: "qndn ilvv pnoz xloe",
  },
});
// register
export const register = async (req, res) => {
  const {
    username,
    email,
    password,
    roll,
    classname,
    semester,
    branch,
    phone,
    address,
  } = req.body;
  try {
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
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath
    );
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
      image: {
        publicId: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    });
    // Save user to database
    const user = await newuser.save();
    res.status(201).json({
      message: "User registered successfully",
      user,
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
    const token = jwt.sign(
      {
        _id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // date today
    const date = new Date()
      .toLocaleString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split(",")[0];
    // reverse date format to dd-mm-yyyy
    const formattedDate = date.split("-").reverse().join("-");
    // console.log(formattedDate);
    // store token in cookie
    const cokiesExpire = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //24*60*60*1000
      httpOnly: true, // catnot be accessed via javascript
      secure: "Production" === false, // false for http and true for https
    };
    res.cookie("Token", token, cokiesExpire);
    await res.status(200).json({
      message: "User logged in successfully",
      token,
      date: formattedDate,
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
  // const {Id}=req.Id;
  try {
    const userdata = await User.findById(req.userId).select("-password -__v");

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

// logout
export const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("Token");
    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in logout",
    });
  }
};
// send email link to reset pasword

export const resetpassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(401).json({ msg: "Enter your Email....!" });
  }

  try {
    const userfind = await User.findOne({ email: email });
    if (!userfind) {
      return res.status(404).json({ msg: "User not found" });
    }

    // console.log(userfind);
    // Generate a reset token
    const resetToken = jwt.sign({ _id: userfind._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const setusertoken = await User.updateOne(
      { _id: userfind._id },
      { verifytoken: resetToken },
      { new: true }
    );
    // console.log(resetToken);
    if (setusertoken) {
      const mailoption = {
        from: "ansarisaifuddin732@gmail.com",
        to: email,
        subject: "sending email for pass reset",
        text: `This link valid for 2 MINUTES ${process.env.FRONTEND_URL}/forgatpassword/${userfind.id}/${resetToken}`,
      };
      await transpoter.sendMail(mailoption);
      console.log("email send successfull");
    }
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};

// validate user for password rese
export const forgatpassword = async (req, res) => {
  const { id, token } = req.params;
  //  console.log(id,token);
  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });
    // console.log("validuser",validuser);
    const varifitoken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(validuser);

    if (validuser || varifitoken) {
      res.json({ success: true, msg: "User found", validuser });
    } else {
      res.status(401).json({ success: false, msg: "Invalid user" });
    }

    // console.log(varifitoken)
  } catch (error) {
    console.error("Forgat password error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};

// password veriify
export const verifypassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });
    const varifitoken = jwt.verify(token, process.env.JWT_SECRET);
    if (validuser||varifitoken ) {
      const setnewuserpass = await User.findByIdAndUpdate(
        { _id: id },
        { password: newpassword }
      );
      const newpassword = await bcrypt.hash(password, 10);
      setnewuserpass.save();
      res
        .status(201)
        .json({
          success: true,
          msg: "Password reset successfully",
          setnewuserpass,
        });
    } else {
      res.status(401).json({ success: false, msg: "Invalid user" });
    }
  } catch (error) {
    console.error("Password verification error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};
