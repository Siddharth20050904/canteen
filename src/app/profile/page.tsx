// src/app/profile/page.tsx
import React from 'react';
import Image from 'next/image';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfilePage = () => {
  // Sample profile data - replace with actual data from your backend
  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 1, 2020',
    bio: 'Food enthusiast and home chef. Love to experiment with new recipes and share them with friends and family.',
    avatarUrl: 'https://via.placeholder.com/150',
    suggestions: [
      {
        id: '1',
        dish: 'Paneer Butter Masala',
        votes: 45,
        status: 'pending',
        date: 'Dec 24, 2024',
      },
      {
        id: '2',
        dish: 'Mixed Fruit Salad',
        votes: 32,
        status: 'approved',
        date: 'Dec 23, 2024',
      },
    ],
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
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={userProfile.avatarUrl}
                  alt="Profile Avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
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
                <h2 className="text-lg font-medium">Member Since</h2>
                <p className="text-gray-600">{userProfile.memberSince}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium">Bio</h2>
                <p className="text-gray-600">{userProfile.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Your Suggestions</h2>
          {userProfile.suggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{suggestion.dish}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(
                          suggestion.status
                        )}`}
                      >
                        {suggestion.status.charAt(0).toUpperCase() +
                          suggestion.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{suggestion.date}</span>
                      <span>•</span>
                      <span>{suggestion.votes} votes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
