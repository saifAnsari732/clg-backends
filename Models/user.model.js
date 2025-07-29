import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roll: {
      type: String,
      required: true,
    },
    classname: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  
   
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
