// src/app/settings/page.tsx
"use client";
import React from 'react';
import { useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Utensils } from 'lucide-react';
import { updateUserProfile, getUserInfo } from '../../../server_actions/updateUserProfile';
import { getSession, signOut } from 'next-auth/react';

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
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
      <form ref={formRef} onSubmit={handleSubmitProfileChange} >
        {/* Profile Settings */}
        <Card>
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
                  name='name'
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
                  name='rollNumber'
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
              <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name='preferences' value={preferencesValue} onChange={(e)=>setPreferencesValue(e.target.value)}>
                <option value={"veg"}>Vegetarian</option>
                <option value={"non_veg"}>Non-Vegetarian</option>
                <option value={"vegan"}>Vegan</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              type="submit">
                Save Changes
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
      </div>
    </Layout>
  );
};

export default SettingsPage;

// Removed duplicate function implementation
