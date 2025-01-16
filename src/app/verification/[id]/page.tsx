"use client";
import React, { useRef, useState } from 'react';
import { verifyOTP } from '../../../../server_actions/verifyOTPAction';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from 'next-auth/react';
import { getUserById } from '../../../../server_actions/userFetch';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { updateOTP } from '../../../../server_actions/updateUserProfile';
import { sendOTPEmail } from '../../../../server_actions/emailActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

const VerifyPage = ({ params }: PageProps) => {
  const { id } = React.use(params);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const index = inputRefs.current.findIndex((ref) => ref === e.currentTarget);
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      setOtp((prevOtp) => {
        const updatedOtp = [...prevOtp];
        updatedOtp[index] = "";
        return updatedOtp;
      });
  
      if (index > 0) {
        (inputRefs.current[index - 1] as HTMLInputElement)?.focus();
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const index = inputRefs.current.findIndex((ref) => ref === target);
    if (target.value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      if (index < otp.length - 1 && inputRefs.current[index + 1]) {
        (inputRefs.current[index + 1] as HTMLInputElement).focus();
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    try {
      e.preventDefault();
      const user = await getUserById(id);
      if(!user) return;

      const res = await verifyOTP(id, otp.join(''));
      if(res.success) {
        const tempPass = localStorage.getItem('temp_pass');
        const signInResult = await signIn('credentials', {
          email: user.email,
          password: tempPass,
          redirect: false,
        });
        localStorage.removeItem('temp_pass');

        if(signInResult?.ok) {
          router.push('/dashboard');
        } else {
          console.log('Login failed');
        }
      }
    } catch(err) {
      console.log(err);
      alert('Invalid OTP');
    }
  };

  const handleResend = async() => {
    const user = await getUserById(id);
    if(!user) return;
    const newOtpUser = await updateOTP(user.email);

    await sendOTPEmail(user.email, newOtpUser.otp);
    alert('OTP sent successfully');
  }

  return (
    <Layout noLayout={true}>
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-green-400 flex items-center justify-center md:shadow-[0_0px_60px_0px_rgba(0,0,0,0.3)] z-10">
          <div className="text-center p-16">
            <Image
              src="/vectors/otp.png"
              alt="Verification illustration"
              className="mx-auto mb-8 rounded-lg w-full h-full"
              width={300}
              height={300}
              priority
              quality={100}
            />
            <h2 className="text-3xl font-bold text-white mb-4">Verify Your Email</h2>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
              Please enter the verification code sent to your email address to complete your registration
            </p>
          </div>
        </div>

        <div className="mt-5 md:w-1/2 flex items-center justify-center bg-white">
          <Card className="w-full max-w-md mx-8 bg-white shadow-lg bg-gradient-to-br from-gray-200 to-gray-150">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Enter Verification Code</CardTitle>
              <p className="text-center text-gray-600 mt-2">
                Enter the 6-digit code we sent to your email
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
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
                    Didn&apos;t receive the code? <button type="button" className="text-blue-600 hover:underline" onClick={handleResend}>Resend</button>
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Verify Email
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyPage;