import bcrypt from "bcrypt";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utlis/sendEmail.js";
import moment from "moment";
import OTPModel from "../Models/OTP.js";
import crypto from "crypto";



const generateOTP = async () => {
  try {
    let OTP;
    let isTaken = true;
    let attempts = 0;
    const maxAttempts = 5; // Limit the number of attempts to prevent an infinite loop

    while (isTaken && attempts < maxAttempts) {
      OTP = generateRandomOTP();
      isTaken = await isOTPTaken(OTP);
      attempts++;
    }

    if (isTaken) {
      throw new Error("Failed to generate a unique OTP after several attempts");
    }

    return OTP;
  } catch (error) {
    console.error("Error generating OTP:", error.message);
    throw error;
  }
};


const generateRandomOTP = () => {
  // Generates a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000);
};

const isOTPTaken = async (otp) => {
  // Check if OTP already exists in the database
  const existingOTP = await OTPModel.findOne({ otp });
  return !!existingOTP; // Returns true if OTP exists, false otherwise
};


export const signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { name, email, password } = req.body;
    console.log(req.body);
    // Check if All Details are there or not
    if (!name || !email || !password) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

// Login controller for authenticating users
export const login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided email
    const user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered`,
      });
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "3d",
        }
      );

      // Save token to user document in database
      user.token = token;
      user.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure, Please Try Again`,
    });
  }
};

//send otp
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);

    // Validate email format
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email is required.",
      });
    }

    // Finding User Details
    const user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, you can send a message to sign up
      return res.status(404).json({
        success: false,
        userExists: false,
        message: "Email not found. Please sign up.",
      });
    }

    // Find OTPs sent in the last 10 minutes
    const tenMinutesAgo = moment().subtract(10, "minutes").toDate();
    const recentOtps = await OTPModel.find({
      email: email,
      createdAt: { $gte: tenMinutesAgo },
    });

    if (recentOtps.length >= 11) {
      return res.status(429).json({
        success: false,
        message: "Too many OTP requests. Please try again later.",
      });
    }

    // If user exists and not exceeded limit, generate and send OTP
    const OTP = await generateOTP();
    const newOtp = new OTPModel({
      email: email,
      otp: OTP,
      createdAt: new Date(), // Ensure createdAt is recorded
    });
    await newOtp.save();

    console.log("OTP-->", OTP)

    // why not async
    sendEmail(email, OTP, "OTP Verification" );

    return res.status(200).json({
      success: true,
      existingUser: true,
      message: "OTP sent successfully. Please sign in.",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if OTP and email are provided
    if (!otp || !email) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required for verification.",
      });
    }

    // Check OTP format and length
    if (otp.length !== 6 || isNaN(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format.",
      });
    }

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found. Please sign up.",
      });
    }

    // Find the most recent OTP for the email
    const lastOtp = await OTPModel.findOne({ email }).sort({ createdAt: -1 });

    if (!lastOtp) {
      return res.status(404).json({
        success: false,
        message: "OTP not found.",
      });
    }

    // Check if the OTP has expired (assuming a 2-minute expiration)
    const otpAge = moment().diff(moment(lastOtp.createdAt), "minutes");
    if (otpAge > 2) {
      await lastOtp.deleteOne(); // Delete only the expired OTP
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    // Constant-time comparison to avoid timing attacks
    const otpBuffer = Buffer.from(lastOtp.otp);
    const providedOtpBuffer = Buffer.from(otp);

    if (
      otpBuffer.length !== providedOtpBuffer.length ||
      !crypto.timingSafeEqual(otpBuffer, providedOtpBuffer)
    ) {
      return res.status(401).json({
        success: false,
        message: "OTP mismatch.",
      });
    }

    // OTP is valid, delete the OTP now
    await lastOtp.deleteOne();

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    // Save token to user document in database
    user.token = token;
    user.password = undefined;
    // Set cookie for token and return success response
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: `User Login Success`,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
