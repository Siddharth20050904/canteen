"use client";
import React, { useRef, useState } from 'react';
import { verifyOTP } from '../../../../server_actions/verifyOTPAction';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from 'next-auth/react';
import { getUserById } from '../../../../server_actions/userFetch';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

const VerifyPage = ({ params }: PageProps) => {
  const { id } = React.use(params);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      e.preventDefault(); // Prevent default behavior
      setOtp((prevOtp) => {
        const updatedOtp = [...prevOtp];
        updatedOtp[index] = ""; // Clear the current input
        return updatedOtp;
      });
  
      if (index > 0) {
        (inputRefs.current[index - 1] as HTMLInputElement)?.focus(); // Move to previous input
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

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
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
  };

  return (
    <Layout noLayout={true}>
      <div className="flex justify-center items-center h-screen">
        <Card className="max-w-md w-full bg-gray-300">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold rounded-lg">Verify Email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-200 rounded-lg p-4">
              <div>
                <label htmlFor="otp" className="text-sm font-medium text-gray-700 mb-2">
                  OTP
                </label>
                <div className="flex space-x-2 justify-center">
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
                      className="shadow-xs flex w-12 h-12 items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-700 outline-none"
                    />
                  ))}
                </div>

              </div>
              <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg">
                Verify
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyPage;