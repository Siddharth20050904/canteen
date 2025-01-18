"use client";

import React, { useEffect, useRef, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// UI Components
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch"

// Icons
import { User, Utensils, Lock, Bell } from 'lucide-react';

// Server Actions
import { updateUserProfile, getUserInfo, updateMenuNotificationPreference } from '../../../server_actions/updateUserProfile';
import { changePassword } from '../../../server_actions/changePass';

// Main component
const SettingsPage = () => {
  // Refs
  const formRef = useRef<HTMLFormElement>(null);

  // State variables
  const [nameValue, setNameValue] = useState('');
  const [rollNumberValue, setRollNumberValue] = useState('');
  const [preferencesValue, setPreferencesValue] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingProfile, setIsChangingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [menuNotifications, setMenuNotifications] = useState(false);

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const session = await getSession();
      if (!session) return;

      const userId = session.user.id;
      const userInfo = await getUserInfo(userId);
      if (userInfo) {
        setNameValue(userInfo.name || '');
        setRollNumberValue(userInfo.rollNumber || '');
        setPreferencesValue(userInfo.preferences || '');
        setMenuNotifications(userInfo.menuNotifications || false);
      }
    }
    fetchUserInfo();
  }, []);

  // Handle profile change submission
  const handleSubmitProfileChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsChangingProfile(true);
    const session = await getSession();

    if (!session) return;

    const userId = session.user.id;
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const name = data.name as string;
    const rollNumber = data.rollNumber as string;
    const preferences = data.preferences as string;

    try {
      const updatedUser = await updateUserProfile(userId, name, rollNumber, preferences);
      if(updatedUser) {
        await signOut({ redirect: false });
        alert('Profile updated successfully, please login again');
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert('Error updating profile');
    } finally { 
      setIsChangingProfile(false);
    }
  }

  // Handle password change
  const handlePasswordChange = async () => {
    setIsChangingPassword(true);
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsChangingPassword(false);
      return;
    }
  
    const session = await getSession();
    if (!session) {
      alert('Please login to change password');
      return;
    }
  
    try {
      await changePassword(session.user.id, currentPassword, newPassword);
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update password');
      }
    } finally {
      setIsChangingPassword(false);
    }
  }

  // Handle notification preference change
  const handleNotificationChange = async () => {
    const session = await getSession();
    if (!session) return;
  
    try {
      await updateMenuNotificationPreference(session.user.id, menuNotifications);
      toast.success('Notification preference updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update notification preference');
    }
  };

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
            <div className="lg:w-1/2">
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
                          className="w-full p-2 border rounded-lg"
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
                          className="w-full p-2 border rounded-lg"
                          value={rollNumberValue}
                          name="rollNumber"
                          onChange={(e)=>setRollNumberValue(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
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
                        className="w-full p-2 border rounded-lg" 
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
                        className={`px-6 py-2 bg-green-600 text-white rounded-lg ${isChangingProfile? 'opacity-50 cursor-not-allowed':'hover:bg-green-700'} transition-colors duration-200`}
                        type="submit"
                      >
                        Save Changes
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </form>
              {/* Email Notifications Card */}
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Menu Updates</h4>
                      <p className="text-sm text-gray-500">Get notified when weekly menu changes</p>
                    </div>
                    <Switch
                      checked={menuNotifications}
                      onCheckedChange={setMenuNotifications}
                      className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200 [&_span[data-state]]:bg-white [&_span[data-state]]:shadow-lg"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button 
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      onClick={handleNotificationChange}
                      type="button"
                    >
                      Save Preference
                    </button>
                  </div>
                </CardContent>
              </Card>
              {/* Change Password Card */}
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full p-2 border rounded-lg"
                      name="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full p-2 border rounded-lg"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full p-2 border rounded-lg"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      className={`px-6 py-2 bg-green-600 text-white rounded-lg ${isChangingPassword? 'opacity-50 cursor-not-allowed':'hover:bg-green-700'} transition-colors duration-200`}
                      type="button"
                      onClick={handlePasswordChange}
                    >
                      Update Password
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <ToastContainer/>
    </Layout>
  );
};

export default SettingsPage;

