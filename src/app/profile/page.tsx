// src/app/profile/page.tsx
"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserById } from '../../../server_actions/userFetch';
import { getTopThreeSuggestionsByUserId, Suggestion} from '../../../server_actions/getSuggestion';
import { getSession } from 'next-auth/react';

interface User {
  id: string;
  name: string | null;
  email: string;
  type: string | null;
  emailVerified: Date | null;
  password: string | null;
  preferences: string | null;
  rollNumber: string | null;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      const userId = session?.user.id;
      const userData = await getUserById(userId || '');
      setUser(userData);
      const suggestionData = await getTopThreeSuggestionsByUserId(parseInt(userId || ''));
      setSuggestions(suggestionData || []);
    };
    fetchUser();
  }, []);

  const userProfile = {
    name: user?.name,
    email: user?.email,
    rollNumber: user?.rollNumber,
    suggestions: suggestions
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-gray-600">View and manage your profile information</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{userProfile.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">Email</h2>
                <p className="text-gray-600">{userProfile.email}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium">Roll Number</h2>
                <p className="text-gray-600">{userProfile.rollNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Your Suggestions</h2>
          {userProfile.suggestions.length > 0 ? (
            userProfile.suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg">{suggestion.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(
                            suggestion.status
                          )}`}
                        >
                          {suggestion.status}
                        </span>
                      </div>
                      <p className="text-gray-600">{suggestion.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600 flex justify-center">No suggestions</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
