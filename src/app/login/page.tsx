// src/app/login/page.tsx
"use client";
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../../server_actions/loginActions';
import { Link } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the server action to authenticate the user
      const res = await loginUser({ email, password });

      if (res.success) {
        setSuccessMessage('Login successful!');
        setError(null);
        setTimeout(() => {
          router.push('/dashboard'); // Redirect to the dashboard or another page on success
        }, 1000);
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <Layout noLayout={true}>
      <div className="flex justify-center items-center h-screen">
        <Card className="max-w-md w-full bg-gray-300">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold rounded-lg">Login</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500">{error}</p>}
            {/* remove the error if success message is displayed */}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-200 rounded-lg p-4">
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
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              <div className="mt-4 text-left">
                <span className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline">
                    Register here
                  </Link>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Login
                </button>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
