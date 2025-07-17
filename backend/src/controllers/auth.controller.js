import bcrypt from "bcryptjs";
import Otp from "../models/otp.model.js";
import User from "../models/user.model.js"
import { generateOTP, sendOtpEmail, generateToken } from "../lib/utils.js";



export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;


  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }


    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }


    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }


    // Remove previous OTPs
    await Otp.deleteMany({ email });


    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const hashedPassword = await bcrypt.hash(password, salt);


    const otpDoc = new Otp({
      email,
      otp: hashedOTP,
      fullName,
      password: hashedPassword,
    });


    await otpDoc.save();
    await sendOtpEmail(email, otp);


    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendotp error:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP and create user
export const verifyotp = async (req, res) => {
  const { email, otp } = req.body;


  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }


    const otpDoc = await Otp.findOne({ email });


    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isOtpValid = await bcrypt.compare(otp, otpDoc.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const now = new Date();
    const diff = (now - otpDoc.createdAt) / 1000;
    if (diff > 600) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP expired" });
    }


    if (otpDoc.verified) {
      return res.status(400).json({ message: "OTP already verified" });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "User already exists" });
    }


    const newUser = await User.create({
      fullName: otpDoc.fullName,
      email: otpDoc.email,
      password: otpDoc.password,
    });


    otpDoc.verified = true;
    await otpDoc.save();
    await Otp.deleteOne({ _id: otpDoc._id });


    const token = generateToken(newUser._id, res);


    return res.status(201).json({
      message: "User registered successfully",
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      role: newUser.role,
      token,
    });
  } catch (err) {
    console.error("verifyotp error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Login
export const login = async (req, res) => {
  const { email, password } = req.body;


  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }


    const token = generateToken(user._id, res);


    return res.status(200).json({
      message: "Login successful",
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const checkAuth = (req,res) => {
    try {
      return res.status(200).json(req.user)   
    } catch (error) {
      console.log(`Error in check Auth Controller ${error.message}`);
      return res.status(500).json({ message: "Internal server Error"})
    }
}