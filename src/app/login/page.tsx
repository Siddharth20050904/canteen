"use client";
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { status } = useSession();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLogin(true);
    e.preventDefault();

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error('An error occurred during login', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Login error:', err);
    }finally{
      setIsLogin(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Layout noLayout={true}>
      <div className="flex min-h-screen flex-col md:flex-row">
        

        <div className="mx-auto w-full bg-green-400 flex items-center justify-center md:w-1/2 md:shadow-[0_0px_60px_0px_rgba(0,0,0,0.3)] z-10">
          <div className="text-center p-16">
            <Image
              src="/vectors/login.png"
              alt="Login illustration"
              className="mx-auto mb-8 rounded-lg -lg w-full h-full"
              width={300}
              height={300}
              priority
              quality={100}
            />
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to Our Platform</h2>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
              Securely access your account and manage your experience with our powerful dashboard
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center bg-white mt-5 mb-5">
          <Card className="w-full max-w-md mx-8 bg-white shadow-lg bg-gradient-to-br from-gray-200 to-gray-150">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Welcome Back</CardTitle>
              <p className="text-center text-gray-600 mt-2">Please sign in to your account</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <button
                  type="submit"
                  className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg ${isLogin? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} transition duration-200`}
                >
                  Sign In
                </button>
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline font-medium">
                      Register here
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default LoginPage;