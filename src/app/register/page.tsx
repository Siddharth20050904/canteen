"use client";

// Importing necessary libraries and components
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { registerUser } from '../../../server_actions/registerActions';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  // Retrieve session data and setup router
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if the user is already authenticated
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Local state for form fields and loading state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Handle form submission for registration
  const handleSubmit = async (e: React.FormEvent) => {
    setIsRegistering(true);
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsRegistering(false);
      return;
    }

    try {
      const res = await registerUser({ name, email, password });

      if (res.success) {
        localStorage.setItem('temp_pass', password);  // Temporarily store password for verification
        router.push(`/verification/${res.id}`);  // Navigate to verification page
      } else {
        toast.error(res.message || 'Registration failed', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('An error occurred during registration, please try again later', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Registration error:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Layout noLayout={true}>
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Left Section - Illustration */}
        <div className="w-full md:w-1/2 bg-green-400 flex items-center justify-center md:shadow-[0_0px_60px_0px_rgba(0,0,0,0.3)] z-10">
          <div className="text-center p-16">
            <Image
              src="/vectors/register.png"
              alt="Registration illustration"
              className="mx-auto mb-8 rounded-lg w-full h-full"
              width={300}
              height={300}
              priority
              quality={100}
            />
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Platform</h2>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
              Create your account and start managing your experience with our powerful dashboard
            </p>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white mt-5 mb-5">
          <Card className="w-full max-w-md mx-8 bg-white shadow-lg bg-gradient-to-br from-gray-200 to-gray-150">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Create Account</CardTitle>
              <p className="text-center text-gray-600 mt-2">Please fill in your details to register</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Input */}
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

                {/* Password Input */}
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
                    placeholder="Create a password"
                  />
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Confirm your password"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg ${isRegistering ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'} transition duration-200`}
                >
                  Create Account
                </button>

                {/* Link to Login */}
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                      Sign in
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

export default RegisterPage;
