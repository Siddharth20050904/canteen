// src/app/suggestions/page.tsx
"use client";
import React, { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {ChefHat, Check, X, Clock, ThumbsUp, ThumbsDown} from 'lucide-react';
import { postSuggestion } from '../../../server_actions/postSuggestion';
import { getSession } from 'next-auth/react';
import { getTopThreeSuggestions } from '../../../server_actions/getSuggestion';
import { Suggestion } from '@prisma/client';
import { updateLikes, updateDislikes, getLikesByUserId, getDislikesByUserId } from '../../../server_actions/upDateLikes';

const SuggestionsPage = () => {
  // Sample suggestions data - replace with actual data from your backend
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [likedSuggestions, setLikedSuggestions] = React.useState<number[]>([]);
  const [dislikedSuggestions, setDislikedSuggestions] = React.useState<number[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here

    const formData = new FormData(event.currentTarget);

    const session = await getSession();
    const user_id = session?.user?.id;

    const formObject = Object.fromEntries(formData.entries());
    const formDataWithUserId = new FormData();
    Object.entries(formObject).forEach(([key, value]) => {
      formDataWithUserId.append(key, value as string);
    });
    formDataWithUserId.append('userId', user_id || '');
    formDataWithUserId.append('username', session?.user?.name || '');

    const newSuggestion = await postSuggestion(formDataWithUserId);

    if(newSuggestion?.success){
      window.location.reload();
    }else{
      alert(newSuggestion?.message);
    }

  };

  useEffect(() => {
    const fetchLikedSuggestionsFromBackend = async () => {
      const session = await getSession();
      const userId = session?.user?.id;
      const likes = await getLikesByUserId(userId || '');
      const dislikes = await getDislikesByUserId(userId || '');
      if (likes) {
        setLikedSuggestions(likes.map((like: { id: number }) => like.id));
      }
      if(dislikes) {
        setDislikedSuggestions(dislikes.map((dislike: { id: number }) => dislike.id));
      }
    };
    fetchLikedSuggestionsFromBackend();
  }
  , []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const res = await getTopThreeSuggestions();
      if (res) {
        setSuggestions(res);
      }
    };
    fetchSuggestions();
  }, []);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleLike = async (suggestionId: number) => {
    const session = await getSession();
    const userId = session?.user?.id;

    const res = await updateLikes(suggestionId, userId || '');

    if (res?.success) {
      setLikedSuggestions([...likedSuggestions, suggestionId]);
      window.location.reload();
    }
  };

  const handleDislike = async (suggestionId: number) => {
    const session = await getSession();
    const userId = session?.user?.id;
    const res = await updateDislikes(suggestionId, userId || '');
    if (res?.success) {
      window.location.reload();
    }
  };

  console.log(likedSuggestions);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Menu Suggestions</h1>
          <p className="text-gray-600">Suggest new dishes and vote for your favorites</p>
        </div>

        {/* Submit Suggestion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Submit New Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dish Name
                  </label>
                  <input 
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter dish name"
                    name='dish'
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name='category'>
                    <option value={'mainCourse'}>Main Course</option>
                    <option value={'sideDish'}>Side Dish</option>
                    <option value={'dessert'}>Dessert</option>
                    <option value={'beverage'}>Beverage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Describe the dish and why it should be added..."
                  name='description'
                />
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Submit Suggestion
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <div className="flex gap-4 flex-wrap">
          <select className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Breakfast</option>
            <option>Main Course</option>
            <option>Side Dish</option>
            <option>Dessert</option>
            <option>Beverage</option>
          </select>
          <select className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <select className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Most Voted</option>
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{suggestion.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(suggestion.status)}`}>
                        {getStatusIcon(suggestion.status)}
                        {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600">{suggestion.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By: {suggestion.username}</span>
                      <span>•</span>
                      <span>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{suggestion.mealType}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <ThumbsUp className={`w-5 h-5 text-blue-500 ${likedSuggestions.includes(suggestion.id) ? 'fill-current' : ''}`} onClick={() => handleLike(suggestion.id)} />
                    </button>
                    <span className="font-medium">{suggestion.likes}</span>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <ThumbsDown className={`w-5 h-5 text-blue-500 ${dislikedSuggestions.includes(suggestion.id) ? 'fill-current' : ''}`} onClick={() => handleDislike(suggestion.id)} />
                    </button>
                    <span className="font-medium">{suggestion.dislikes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          <button className="px-6 py-2 border rounded-lg hover:bg-gray-50">
            Load More Suggestions
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SuggestionsPage;