// src/app/feedback/page.tsx
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Filter } from 'lucide-react';

interface FeedbackType {
  id: string;
  meal: string;
  date: string;
  rating: number;
  comment: string;
  category: string;
}

const FeedbackPage = () => {
  // Sample feedback data - replace with actual data from your backend
  const feedbackHistory: FeedbackType[] = [
    {
      id: '1',
      meal: 'Breakfast',
      date: 'Dec 24, 2024',
      rating: 4,
      comment: 'The idli and sambar were excellent today.',
      category: 'Vegetarian'
    },
    {
      id: '2',
      meal: 'Lunch',
      date: 'Dec 23, 2024',
      rating: 3,
      comment: 'Rice was good but dal could be better.',
      category: 'Vegetarian'
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Meal Feedback</h1>
          <p className="text-gray-600">Share your dining experience and help us improve</p>
        </div>

        {/* Submit Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle>Submit New Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Meal Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Meal
                </label>
                <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className="w-6 h-6 text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Vegetarian</option>
                  <option>Non-Vegetarian</option>
                  <option>Hygiene</option>
                  <option>Service</option>
                </select>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Comments
                </label>
                <textarea 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Share your experience..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Feedback History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Previous Feedback</CardTitle>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackHistory.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{feedback.meal}</h3>
                      <p className="text-sm text-gray-600">{feedback.date}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {feedback.category}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {renderStars(feedback.rating)}
                  </div>
                  <p className="text-gray-700">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FeedbackPage;