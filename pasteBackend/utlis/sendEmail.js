import nodemailer from "nodemailer";
export const sendEmail = async (email, otp, title) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `Otp <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `YOUR OTP IS ${otp}`,
    });

    // console.log(info);
    return info;
  } catch (error) {
    console.warn(error.message);
  }
};
