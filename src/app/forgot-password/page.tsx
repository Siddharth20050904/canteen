'use client';

import React, { useState } from 'react';
import { sendOTPEmail } from '../../../server_actions/emailActions';
import { updateOTP } from '../../../server_actions/updateUserProfile';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [sendingOTP, setSendingOTP] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    setSendingOTP(true);
    e.preventDefault();
    try{
      const result = await updateOTP(email);
      await sendOTPEmail(email, result.otp);
      router.push(`/reset-password/${result.id}`);
    }catch(error){
      toast.error("Error occured please recheck your email", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log(error);
    }finally{
      setSendingOTP(false);
    }
  };

  return (
    <Layout noLayout={true}>
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-green-400 flex items-center justify-center md:shadow-[0_0px_60px_0px_rgba(0,0,0,0.3)] z-10">
          <div className="text-center p-16">
            <Image
              src="/vectors/forgot-password.png"
              alt="Forgot Password illustration"
              className="mx-auto mb-8 rounded-lg w-full h-full"
              width={300}
              height={300}
              priority
              quality={100}
            />
            <h2 className="text-3xl font-bold text-white mb-4">Forgot Your Password?</h2>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
              Don&apos;t worry! Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>
        </div>

        <div className="mt-5 md:w-1/2 flex items-center justify-center bg-white">
          <Card className="w-full max-w-md mx-8 bg-white shadow-lg bg-gradient-to-br from-gray-200 to-gray-150">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Reset Password</CardTitle>
              <p className="text-center text-gray-600 mt-2">
                Enter your email address to receive a password reset link
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col space-y-4">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg ${sendingOTP? 'opacity-50 cursor-not-allowed':'hover:bg-green-700'} transition duration-200`}
                >
                  Send Reset Link
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer/>
    </Layout>
  );
}

