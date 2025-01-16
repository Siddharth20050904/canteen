"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardContentSkeleton, CardTitleSkeleton } from '@/components/ui/card';
import { getUserById } from '../../../server_actions/userFetch';
import { getTopThreeSuggestionsByUserId, Suggestion} from '../../../server_actions/getSuggestion';
import { getSession } from 'next-auth/react';
import Image from 'next/image';

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
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [loadingSuggestion, setLoadingSuggestion] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      const userId = session?.user.id;
      const userData = await getUserById(userId || '');
      setUser(userData);
      setLoadingEmail(false);
      const suggestionData = await getTopThreeSuggestionsByUserId(userId || '');
      setSuggestions(suggestionData || []);
      setLoadingSuggestion(false);
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        {/* Page Header */}
        <div className='grid grid-cols-1 lg:grid-cols-2 text-center py-6'>
          <div/>
          <h1 className="text-2xl font-bold">Profile</h1>
          <div/>
          <p className="text-gray-600">View and manage your profile information</p>
        </div>
        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Hero Image */}
            <div className="lg:w-1/2 flex items-start justify-start">
              <div className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] mx-auto">
                <div className="pb-[100%]">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <Image 
                      src="/vectors/profile.png"
                      alt="Profile Vector"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Information and Suggestions */}
            <div className="lg:w-1/2">
              <div className="space-y-8">
                {/* Profile Card */}
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    {loadingEmail ? <CardTitleSkeleton/> : 
                      <CardTitle className="flex items-center gap-2">
                        <span>{userProfile.name}</span>
                      </CardTitle>
                    }
                  </CardHeader>
                  {loadingSuggestion ? <CardContentSkeleton/> :
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-lg font-medium">Email</h2>
                          <p className="text-gray-600 text-sm md:text-lg">{userProfile.email}</p>
                        </div>
                        <div>
                          <h2 className="text-lg font-medium">Roll Number</h2>
                          <p className="text-gray-600">{userProfile.rollNumber}</p>
                        </div>
                      </div>
                    </CardContent>
                  }
                </Card>

                {/* Suggestions List */}
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle>Your Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingSuggestion ? <CardContentSkeleton/> : 
                      (userProfile.suggestions.length > 0 ? (
                        <div className="space-y-4">
                          {userProfile.suggestions.map((suggestion) => (
                            <div key={suggestion.id} className="p-4 bg-gray-50 rounded-lg">
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
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 flex justify-center">No suggestions</p>
                      ))
                    }
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ProfilePage;

