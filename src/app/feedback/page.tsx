// src/app/feedback/page.tsx
"use client";
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { addReview } from '../../../server_actions/reviewAddition';
import { useSession } from 'next-auth/react';
import { logActivity } from '../../../server_actions/logActivity';

const FeedbackPage = () => {
  const { data: session } = useSession();
  const [rating, setRating] = React.useState(0);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!session?.user?.id) {
      return;
    }

    const review = {
      meal: formData.get('meal') as string,
      rating: rating,
      comment: formData.get('comment') as string,
      category: formData.get('category') as string,
      userId: session.user.id,
      day: formData.get('day') as string,
    };

    console.log(review);

    const response = await addReview(review);
    if (response.success) {
      await logActivity(session.user.id, 'Submitted a feedback', 'feedback');
      window.location.reload(); 
    }
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
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Meal Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Meal
                </label>
                <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name='meal'>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="snack">Snack</option>
                  <option value="dinner">Dinner</option>
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
                      onClick={() => setRating(star)}
                    >
                      <Star className={`w-6 h-6 fill-current ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name='category'>
                  <option value='mainCourse'>Main Course</option>
                  <option value='sideDish'>Side Dish</option>
                  <option value='dessert'>Dessert</option>
                  <option value='beverage'>Beverage</option>
                </select>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of the Week
                  </label>
                  <select
                    name="day"
                    defaultValue={'Monday'}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
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
                  name='comment'
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
      </div>
    </Layout>
  );
};export default FeedbackPage;