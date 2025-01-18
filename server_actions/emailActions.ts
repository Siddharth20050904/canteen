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
  return {success: true};
}

export async function sendMenuUpdates(email: string[], data: { dish: string; category: string; day: string; mealType: string }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noreplyverify404@gmail.com',
      pass: process.env.MAIL_PASS,
    },
  });

  const emailPromises = email.map(async (emailAddress) => {
    const mailOptions = {
      from: 'noreplyverify404@gmail.com',
      to: emailAddress,
      subject: 'Menu Updates',
      text: `A new meal has been added to the menu: ${data.dish}.\nOn ${data.day} for ${data.mealType.charAt(0).toUpperCase()+ data.mealType.slice(1)} as ${data.category=='mainCourse'?'Main Course':data.category=='sideDish'?'Side Dish':data.category=='beverage'?'Beverage':'Dessert'}`,
    };
    return transporter.sendMail(mailOptions);
  });

  try {
    await Promise.all(emailPromises);
    console.log("All emails sent successfully");
  } catch (error) {
    console.error("Error sending emails:", error);
    throw error;
  }
}
