'use client';

/**
 * @fileoverview Reset Password page component that handles OTP verification and password reset
 * The component implements a two-step process:
 * 1. OTP verification using a 6-digit code
 * 2. New password creation
 */

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Image from 'next/image';

// UI Components
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Server Actions
import { verifyOTP } from '../../../../server_actions/verifyOTPAction';
import { resetPassword, updateOTP } from '../../../../server_actions/updateUserProfile';
import { getUserById } from '../../../../server_actions/userFetch';
import { sendOTPEmail } from '../../../../server_actions/emailActions';

interface ResetPasswordProps {
  params: Promise<{ id: string }>;
}

/**
 * ResetPassword Component
 * 
 * Handles the complete password reset flow including OTP verification
 * and new password creation in a two-step process.
 * 
 * @param {ResetPasswordProps} props - Component props containing user ID
 * @returns {JSX.Element} The reset password page component
 */
export default function ResetPassword({ params }: ResetPasswordProps) {
  // Resolve async params
  const resolvedParams = use(params);

  // State Management
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // Step 1: OTP verification, Step 2: New password
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  /**
   * Handles keydown events for OTP input fields
   * Manages deletion and navigation between input fields
   * 
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const index = inputRefs.current.findIndex((ref) => ref === e.currentTarget);
    
    // Allow only numbers, backspace, delete, tab, and meta keys
    if (!/^[0-9]{1}$/.test(e.key) && 
        e.key !== "Backspace" && 
        e.key !== "Delete" && 
        e.key !== "Tab" && 
        !e.metaKey) {
      e.preventDefault();
    }

    // Handle backspace/delete
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      setOtp((prevOtp) => {
        const updatedOtp = [...prevOtp];
        updatedOtp[index] = "";
        return updatedOtp;
      });
  
      // Move focus to previous input
      if (index > 0) {
        (inputRefs.current[index - 1] as HTMLInputElement)?.focus();
      }
    }
  };

  /**
   * Handles input changes for OTP fields
   * Automatically moves focus to next field when a digit is entered
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const index = inputRefs.current.findIndex((ref) => ref === target);
    if (target.value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      // Move focus to next input
      if (index < otp.length - 1 && inputRefs.current[index + 1]) {
        (inputRefs.current[index + 1] as HTMLInputElement).focus();
      }
    }
  };

  /**
   * Handles focus events for OTP input fields
   * Selects the entire content of the input when focused
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  /**
   * Handles paste events for OTP input
   * Validates and distributes pasted content across input fields
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    setOtp(text.split(""));
  };

  /**
   * Handles OTP verification submission
   * Moves to password reset step if verification is successful
   */
  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await verifyOTP(resolvedParams.id, otp.join(''));
      if (result.success) {
        toast.success('OTP sent successfully.');
        setStep(2);
      } else {
        toast.error('Error occurred while sending OTP. Please try again.');
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Error occurred while sending OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles password reset submission
   * Redirects to login page on successful password reset
   */
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await resetPassword(resolvedParams.id, newPassword);
      if (result.success) {
        router.push('/login');
      } else {
        toast.error('Failed to reset password');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles OTP resend request
   * Generates new OTP and sends it to user's email
   */
  const handleResend = async () => {
    try {
      const user = await getUserById(resolvedParams.id);
      if (!user) return;
      
      const newOtpUser = await updateOTP(user.email);
      const res = await sendOTPEmail(user.email, newOtpUser.otp);
      
      if (res.success) {
        toast.success('OTP sent successfully.');
      } else {
        toast.error('Error occurred while sending OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Error occurred while sending OTP. Please try again.');
      console.error(error);
    }
  };

  return (
    <Layout noLayout={true}>
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Left Section - Illustration and Description */}
        <div className="w-full md:w-1/2 bg-green-400 flex items-center justify-center md:shadow-[0_0px_60px_0px_rgba(0,0,0,0.3)] z-10">
          <div className="text-center p-16">
            <Image
              src="/vectors/reset-password.png"
              alt="Reset Password illustration"
              className="mx-auto mb-8 rounded-lg w-full h-full"
              width={300}
              height={300}
              priority
              quality={100}
            />
            <h2 className="text-3xl font-bold text-white mb-4">
              Reset Your Password
            </h2>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
              {step === 1 
                ? "Enter the verification code sent to your email to reset your password."
                : "Create a new password for your account."}
            </p>
          </div>
        </div>

        {/* Right Section - OTP/Password Form */}
        <div className="mt-5 md:w-1/2 flex items-center justify-center bg-white">
          <Card className="w-full max-w-md mx-8 bg-white shadow-lg bg-gradient-to-br from-gray-200 to-gray-150">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                {step === 1 ? "Enter Verification Code" : "Set New Password"}
              </CardTitle>
              <p className="text-center text-gray-600 mt-2">
                {step === 1 
                  ? "Enter the 6-digit code we sent to your email"
                  : "Create a strong password for your account"}
              </p>
            </CardHeader>
            <CardContent>
              {step === 1 ? (
                // OTP Verification Form
                <form onSubmit={handleOTPVerification} className="space-y-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-1 md:space-x-2 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={handleInput}
                          onKeyDown={handleKeyDown}
                          onFocus={handleFocus}
                          onPaste={handlePaste}
                          ref={(el: HTMLInputElement | null) => {
                            if (el) {
                              inputRefs.current[index] = el;
                            }
                          }}
                          className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Didn&apos;t receive the code? {" "}
                      <button 
                        type="button" 
                        className="text-blue-600 hover:underline" 
                        onClick={handleResend}
                      >
                        Resend
                      </button>
                    </p>
                  </div>
                  <button
                    type="submit"
                    className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                    } transition duration-200`}
                  >
                    Verify Code
                  </button>
                </form>
              ) : (
                // Password Reset Form
                <form onSubmit={handlePasswordReset} className="space-y-8">
                  <div className="flex flex-col space-y-4">
                    <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-14 px-3 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                    } transition duration-200`}
                  >
                    Reset Password
                  </button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}