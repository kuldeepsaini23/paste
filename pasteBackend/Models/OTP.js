import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
		otp: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			expires: 60 * 10, // The document will be automatically deleted after 5 minutes of its creation time
		},
	},
	{ timestamps: true }
);

const OTP = mongoose.model('Otp', otpSchema);

export default OTP;


