'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Clock, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Suggestion } from '@prisma/client';
import { getAllSuggestions } from '../../../server_actions/getSuggestion';
import { getSession } from 'next-auth/react';
import { updateLikes, updateDislikes, getLikesByUserId, getDislikesByUserId } from '../../../server_actions/upDateLikes';
import { updateSuggestionStatus } from '../../../server_actions/postSuggestion';

// Constants
const ITEMS_PER_PAGE = 10;

// Types
type LikeDislikeState = number[];

const ReviewSuggestionsPage = () => {
  // State management
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedSuggestions, setLikedSuggestions] = useState<LikeDislikeState>([]);
  const [dislikedSuggestions, setDislikedSuggestions] = useState<LikeDislikeState>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const fetchUserInfo = async () => {
      const session = await getSession();
      if (session?.user?.userType === 'admin') {
        setIsAdmin(true);
      }
    };
    fetchUserInfo();
  }, []);

  // Fetch suggestions
  const fetchSuggestions = async (page: number) => {
    try {
      setLoading(true);
      const start = (page - 1) * ITEMS_PER_PAGE;
      const newSuggestions = await getAllSuggestions();
      
      if (newSuggestions) {
        setTotalPages(Math.ceil(newSuggestions.length / ITEMS_PER_PAGE));
        const paginatedSuggestions = newSuggestions.slice(start, start + ITEMS_PER_PAGE);
        setSuggestions(paginatedSuggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions(currentPage);
  }, [currentPage]);

  // Fetch liked and disliked suggestions
  useEffect(() => {
    const fetchLikedAndDislikedSuggestions = async () => {
      const session = await getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const [likes, dislikes] = await Promise.all([
        getLikesByUserId(userId),
        getDislikesByUserId(userId)
      ]);

      setLikedSuggestions(likes ? likes.map((like: { id: number }) => like.id) : []);
      setDislikedSuggestions(dislikes ? dislikes.map((dislike: { id: number }) => dislike.id) : []);
    };
    fetchLikedAndDislikedSuggestions();
  }, []);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    );

    // First page if not visible
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 rounded-md hover:bg-gray-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots-1">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-green-500 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page if not visible
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-2">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 rounded-md hover:bg-gray-100"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    );

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        {pages}
      </div>
    );
  };

  // Helper functions
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

  // Like and dislike handlers
  const handleLike = async (suggestionId: number) => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId || likedSuggestions.includes(suggestionId)) return;

    // Optimistically update the state
    setLikedSuggestions((prev) => [...prev, suggestionId]);
    setDislikedSuggestions((prev) => prev.filter(id => id !== suggestionId));
    setSuggestions((prevSuggestions) =>
      prevSuggestions.map(suggestion => {
        if (suggestion.id === suggestionId) {
          return {
            ...suggestion,
            likes: suggestion.likes + 1,
            dislikes: suggestion.dislikes > 0 ? suggestion.dislikes - 1 : suggestion.dislikes,
          };
        }
        return suggestion;
      })
    );

    const response = await updateLikes(suggestionId, userId);
    if (!response.success) {
      // Revert the state if the API call fails
      setLikedSuggestions((prev) => prev.filter(id => id !== suggestionId));
      setDislikedSuggestions((prev) => [...prev, suggestionId]);
      setSuggestions((prevSuggestions) =>
        prevSuggestions.map(suggestion => {
          if (suggestion.id === suggestionId) {
            return {
              ...suggestion,
              likes: suggestion.likes - 1,
              dislikes: suggestion.dislikes + 1,
            };
          }
          return suggestion;
        })
      );
    }
  };

  const handleDislike = async (suggestionId: number) => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId || dislikedSuggestions.includes(suggestionId)) return;

    // Optimistically update the state
    setDislikedSuggestions((prev) => [...prev, suggestionId]);
    setLikedSuggestions((prev) => prev.filter(id => id !== suggestionId));
    setSuggestions((prevSuggestions) =>
      prevSuggestions.map(suggestion => {
        if (suggestion.id === suggestionId) {
          return {
            ...suggestion,
            dislikes: suggestion.dislikes + 1,
            likes: suggestion.likes > 0 ? suggestion.likes - 1 : suggestion.likes,
          };
        }
        return suggestion;
      })
    );

    const response = await updateDislikes(suggestionId, userId);
    if (!response.success) {
      // Revert the state if the API call fails
      setDislikedSuggestions((prev) => prev.filter(id => id !== suggestionId));
      setLikedSuggestions((prev) => [...prev, suggestionId]);
      setSuggestions((prevSuggestions) =>
        prevSuggestions.map(suggestion => {
          if (suggestion.id === suggestionId) {
            return {
              ...suggestion,
              dislikes: suggestion.dislikes - 1,
              likes: suggestion.likes + 1,
            };
          }
          return suggestion;
        })
      );
    }
  };

  // Admin action handlers
  const handleAccept = async (suggestionId: number) => {
    const updatedSuggestions = suggestions.map(suggestion =>
      suggestion.id === suggestionId ? { ...suggestion, status: 'approved' } : suggestion
    );
    setSuggestions(updatedSuggestions);

    try {
      await updateSuggestionStatus(suggestionId, 'approved');
    } catch (error) {
      setSuggestions(suggestions);
      console.error('Error updating suggestion status:', error);
    }
  };

  const handleReject = async (suggestionId: number) => {
    const updatedSuggestions = suggestions.map(suggestion =>
      suggestion.id === suggestionId ? { ...suggestion, status: 'rejected' } : suggestion
    );
    setSuggestions(updatedSuggestions);
    try {
      await updateSuggestionStatus(suggestionId, 'rejected');
    } catch (error) {
      setSuggestions(suggestions);
      console.error('Error updating suggestion status:', error);
    }
  };

  // Render suggestion card
  const renderSuggestionCard = (suggestion: Suggestion) => (
    <Card key={`suggestion-${suggestion.id}`} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
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
            {isAdmin && suggestion.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(suggestion.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(suggestion.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
            <div className="flex items-center gap-[3vw] md:gap-4 text-sm text-gray-500 max-w-[50vw]">
              <span>By: {suggestion.username}</span>
              <span>•</span>
              <span>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{suggestion.mealType == 'mainCourse' ? 'Main Course' : suggestion.mealType == 'sideDish' ? 'Side Dish' : suggestion.mealType.charAt(0).toUpperCase() + suggestion.mealType.slice(1) }</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              className={`flex items-center gap-1`}
              onClick={() => handleLike(suggestion.id)}
            >
              <ThumbsUp className={`w-4 h-4 text-green-500 ${likedSuggestions.includes(suggestion.id) ? 'fill-green-500' : ''}`} />
              <span>{suggestion.likes}</span>
            </button>
            <button
              className={`flex items-center gap-1`}
              onClick={() => handleDislike(suggestion.id)}
            >
              <ThumbsDown className={`w-4 h-4 text-green-500 ${dislikedSuggestions.includes(suggestion.id) ? 'fill-green-500' : ''}`} />
              <span>{suggestion.dislikes}</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold">Review Suggestions</h1>
          <p className="text-gray-600">Review and manage all submitted suggestions</p>
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse text-gray-500">Loading suggestions...</div>
              </div>
            ) : (
              <>
                {suggestions.map((suggestion) => renderSuggestionCard(suggestion))}
                {suggestions.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No suggestions available
                  </div>
                )}
                {suggestions.length > 0 && renderPagination()}
              </>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ReviewSuggestionsPage;

