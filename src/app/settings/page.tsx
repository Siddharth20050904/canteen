"use client";
import React from 'react';
import { useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Utensils } from 'lucide-react';
import { updateUserProfile, getUserInfo } from '../../../server_actions/updateUserProfile';
import { getSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const SettingsPage = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [nameValue, setNameValue] = React.useState('');
  const [rollNumberValue, setRollNumberValue] = React.useState('');
  const [preferencesValue, setPreferencesValue] = React.useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const session = await getSession();
      if (!session) {
        return;
      }
      const userId = session.user.id;
      const userInfo = await getUserInfo(userId);
      if (userInfo) {
        setNameValue(userInfo.name || '');
        setRollNumberValue(userInfo.rollNumber || '');
        setPreferencesValue(userInfo.preferences || '');
      }
    }
    fetchUserInfo();
  }, []);

  const handleSubmitProfileChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = await getSession();

    if (!session) {
      return;
    }

    const userId = session.user.id;
    const form = formRef.current;
    if (!form) {
      return;
    }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const name = data.name as string;
    const rollNumber = data.rollNumber as string;
    const preferences = data.preferences as string;

    try {
      const updatedUser = await updateUserProfile(userId, name, rollNumber, preferences);
      if(updatedUser) {
        signOut();
        alert('Profile updated successfully, please login again');
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert('Error updating profile');
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        {/* Page Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 text-center items-center justify-center">
          <div/>
          <h1 className="text-2xl font-bold">Settings</h1>
          <div/>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Hero Image */}
            <div className="lg:w-1/2 flex items-start justify-start">
              <div className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] mx-auto">
                <div className="pb-[100%]">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <Image 
                      src="/vectors/settings.png"
                      alt="Settings Vector"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings Form */}
            <div className="lg:w-1/2 h-[calc(100vh-12rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <form ref={formRef} onSubmit={handleSubmitProfileChange} className="space-y-8 pb-8">
                {/* Profile Settings Card */}
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          name="name"
                          value={nameValue}
                          onChange={(e) => setNameValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Roll Number
                        </label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={rollNumberValue}
                          name="rollNumber"
                          onChange={(e)=>setRollNumberValue(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Meal Preferences Card */}
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="w-5 h-5" />
                      Meal Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dietary Preferences
                      </label>
                      <select 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        name="preferences" 
                        value={preferencesValue} 
                        onChange={(e)=>setPreferencesValue(e.target.value)}
                      >
                        <option value="veg">Vegetarian</option>
                        <option value="non_veg">Non-Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        type="submit"
                      >
                        Save Changes
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default SettingsPage;