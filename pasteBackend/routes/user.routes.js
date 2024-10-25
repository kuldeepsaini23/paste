// Import the required modules
import { Router } from "express"
import { login, sendOtp, signup, verifyOtp } from "../Controller/auth.js"

const router = Router();
// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)


// Route for send otp
router.post("/send-otp", sendOtp)


// Route for verify otp
router.post("/verify-otp", verifyOtp)

export default router;