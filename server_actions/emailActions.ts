"use server";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export async function sendOTPEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noreplyverify404@gmail.com',
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'noreplyverify404@gmail.com',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}