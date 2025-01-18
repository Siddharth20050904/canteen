// src/app/suggestions/page.tsx
"use client";

import React, { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Check, X, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { postSuggestion } from '../../../server_actions/postSuggestion';
import { getSession } from 'next-auth/react';
import { getTopThreeSuggestions } from '../../../server_actions/getSuggestion';
import { Suggestion } from '@prisma/client';
import { updateLikes, updateDislikes, getLikesByUserId, getDislikesByUserId } from '../../../server_actions/upDateLikes';
import { logActivity } from '../../../server_actions/logActivity';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [likedSuggestions, setLikedSuggestions] = React.useState<number[]>([]);
  const [dislikedSuggestions, setDislikedSuggestions] = React.useState<number[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  // Handle form submission for new suggestions
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

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

    const response = await postSuggestion(formDataWithUserId);
    if (!response || !response.success) {
      toast.error('Failed to post suggestion', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      await logActivity(user_id || '', 'Suggestion created', 'suggestion');
      toast.success('Suggestion posted successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setSubmitting(false);
  };
  // Fetch likes and dislikes for the user
  useEffect(() => {
    const fetchLikedSuggestionsFromBackend = async () => {
      const session = await getSession();
      const userId = session?.user?.id;
      const likes = await getLikesByUserId(userId || '');
      const dislikes = await getDislikesByUserId(userId || '');
      if (likes) setLikedSuggestions(likes.map((like: { id: number }) => like.id));
      if (dislikes) setDislikedSuggestions(dislikes.map((dislike: { id: number }) => dislike.id));
    };
    fetchLikedSuggestionsFromBackend();
  }, []);

  // Fetch top three suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      const res = await getTopThreeSuggestions();
      if (res) setSuggestions(res);
    };
    fetchSuggestions();
  }, []);

  // Determine color based on suggestion status
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

  // Determine icon based on suggestion status
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

  // Handle like button action
  const handleLike = async (suggestionId: number) => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId || likedSuggestions.includes(suggestionId)) return;

    optimisticallyUpdateState('like', suggestionId);
    const response = await updateLikes(suggestionId, userId || '');
    if (!response.success) revertState('like', suggestionId);
  };

  // Handle dislike button action
  const handleDislike = async (suggestionId: number) => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId || dislikedSuggestions.includes(suggestionId)) return;

    optimisticallyUpdateState('dislike', suggestionId);
    const response = await updateDislikes(suggestionId, userId || '');
    if (!response.success) revertState('dislike', suggestionId);
  };

  // Optimistically update like/dislike state
  const optimisticallyUpdateState = (action: 'like' | 'dislike', suggestionId: number) => {
    if (action === 'like') {
      setLikedSuggestions([...likedSuggestions, suggestionId]);
      setDislikedSuggestions(dislikedSuggestions.filter(id => id !== suggestionId));
      updateSuggestionCount(suggestionId, 1, -1);
    } else {
      setDislikedSuggestions([...dislikedSuggestions, suggestionId]);
      setLikedSuggestions(likedSuggestions.filter(id => id !== suggestionId));
      updateSuggestionCount(suggestionId, -1, 1);
    }
  };

  // Revert like/dislike state if API call fails
  const revertState = (action: 'like' | 'dislike', suggestionId: number) => {
    if (action === 'like') {
      setLikedSuggestions(likedSuggestions);
      setDislikedSuggestions([...dislikedSuggestions, suggestionId]);
      updateSuggestionCount(suggestionId, -1, 1);
    } else {
      setDislikedSuggestions(dislikedSuggestions);
      setLikedSuggestions([...likedSuggestions, suggestionId]);
      updateSuggestionCount(suggestionId, 1, -1);
    }
  };

  // Update suggestion count based on like or dislike
  const updateSuggestionCount = (suggestionId: number, likeChange: number, dislikeChange: number) => {
    setSuggestions(suggestions.map(suggestion => {
      if (suggestion.id === suggestionId) {
        return {
          ...suggestion,
          likes: suggestion.likes + likeChange,
          dislikes: suggestion.dislikes + dislikeChange
        };
      }
      return suggestion;
    }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        <div className="text-center py-8 px-[5vw] grid grid-cols-1 lg:grid-cols-2">
          <div/>
          <h1 className="text-2xl font-bold">Menu Suggestions</h1>
          <div/>
          <p className="text-gray-600">Suggest new dishes and vote for your favorites</p>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex items-start justify-center">
                <div className="relative w-full max-w-[500px]">
                  <div className="pb-[100%]">
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <Image 
                        src="/vectors/suggestions.png"
                        alt="Suggestions Vector"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
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
                            className="w-full p-2 border rounded-lg focus:ring-blue-500"
                            placeholder="Enter dish name"
                            name="dish"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select 
                            className="w-full p-2 border rounded-lg focus:ring-blue-500" 
                            name="category" 
                            required
                          >
                            <option value="mainCourse">Main Course</option>
                            <option value="sideDish">Side Dish</option>
                            <option value="dessert">Dessert</option>
                            <option value="beverage">Beverage</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea 
                          className="w-full p-2 border rounded-lg focus:ring-blue-500 min-h-[100px]"
                          placeholder="Describe the dish and why it should be added..."
                          name="description"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className={`bg-green-600 text-white py-2 px-6 rounded-lg ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'} transition-colors duration-200`}
                        >
                          Submit Suggestion
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="font-bold text-3xl">Recent Suggestions</div>

            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 max-w-[50vw]">
                          <h3 className="font-medium text-lg">{suggestion.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(suggestion.status)}`}>
                            {getStatusIcon(suggestion.status)}
                            {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 max-w-[50vw]">{suggestion.description}</p>
                        <div className="flex items-center gap-[1vw] text-sm text-gray-500 max-w-[50vw]">
                          <span>By: {suggestion.username}</span>
                          <span>•</span>
                          <span>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{suggestion.mealType === 'mainCourse' ? 'Main Course' : suggestion.mealType === 'sideDish' ? 'Side Dish' : suggestion.mealType === 'beverage' ? 'Beverage' : 'Dessert'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                          <ThumbsUp 
                            className={`w-5 h-5 text-green-400 ${likedSuggestions.includes(suggestion.id) ? 'text-green-400 fill-current' : ''}`}
                            onClick={() => handleLike(suggestion.id)} 
                          />
                        </button>
                        <span className="font-medium">{suggestion.likes}</span>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                          <ThumbsDown 
                            className={`w-5 h-5 text-green-400 ${dislikedSuggestions.includes(suggestion.id) ? 'text-green-400 fill-current' : ''}`}
                            onClick={() => handleDislike(suggestion.id)} 
                          />
                        </button>
                        <span className="font-medium">{suggestion.dislikes}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <ToastContainer/>
    </Layout>
  );
};

export default SuggestionsPage;
