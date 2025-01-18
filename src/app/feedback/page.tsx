'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare } from 'lucide-react';
import { addReview } from '../../../server_actions/reviewAddition';
import { useSession } from 'next-auth/react';
import { logActivity } from '../../../server_actions/logActivity';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ===== Type Definitions =====
interface FormOption {
  label: string;
  value: string;
}

interface ReviewData {
  meal: string;
  rating: number;
  comment: string;
  category: string;
  userId: string;
  day: string;
}

/**
 * FeedbackPage Component
 * 
 * A comprehensive page for users to submit meal feedback.
 * Features:
 * - Star rating system
 * - Multiple choice selections for meal and category
 * - Day selection
 * - Comment submission
 * - Toast notifications for feedback status
 */
const FeedbackPage = () => {
  // ===== State and Session Management =====
  const { data: session } = useSession();
  const [rating, setRating] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  
  // ===== Form Submission Handler =====
  /**
   * Handles the submission of the feedback form
   * @param event - Form submission event
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.user?.id) return;

    const formData = new FormData(event.currentTarget);
    const review = createReviewObject(formData, rating, session.user.id);

    try {
      setSubmitting(true);
      const response = await addReview(review);
      
      if (response.success) {
        await logActivity(session.user.id, 'Submitted a feedback', 'feedback');
        showToast('success', 'Feedback submitted successfully');
      } else {
        showToast('error', 'Failed to submit feedback');
      }
    } catch(error) {
      showToast('error', 'Failed to submit feedback');
      console.log(error);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        {renderPageHeader()}
        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {renderHeroImage()}
            <div className="lg:w-1/2 space-y-8">
              {renderFeedbackForm(handleSubmit, rating, setRating, submitting)}
            </div>
          </div>
        </main>
      </div>
      <ToastContainer/>
    </Layout>
  );
};

// ===== Utility Functions =====
/**
 * Creates a review object from form data
 */
const createReviewObject = (formData: FormData, rating: number, userId: string): ReviewData => ({
  meal: formData.get('meal') as string,
  rating,
  comment: formData.get('comment') as string,
  category: formData.get('category') as string,
  userId,
  day: formData.get('day') as string,
});

/**
 * Shows a toast notification
 */
const showToast = (type: 'success' | 'error', message: string) => {
  const toastConfig = {
    position: "top-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  if (type === 'success') {
    toast.success(message, toastConfig);
  } else {
    toast.error(message, toastConfig);
  }
};
// ===== UI Component Renderers =====
/**
 * Renders the page header section
 */
const renderPageHeader = () => (
  <div className='text-center mb-8 grid grid-cols-1 lg:grid-cols-2'>
    <div></div>
    <h1 className="text-2xl font-bold">Meal Feedback</h1>
    <div></div>
    <p className="text-gray-600">Share your dining experience and help us improve</p>
  </div>
);

/**
 * Renders the hero image section
 */
const renderHeroImage = () => (
  <div className="lg:w-1/2 flex items-start justify-start">
    <div className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] mx-auto">
      <div className="pb-[100%]">
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <Image 
            src="/vectors/feedback.png"
            alt="Feedback Vector"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Renders the feedback form with all its components
 */
const renderFeedbackForm = (
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  rating: number,
  setRating: React.Dispatch<React.SetStateAction<number>>,
  submitting: boolean
) => (
  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-green-600" />
        <span>Submit New Feedback</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {renderFormField('Select Meal', 'meal', renderSelectField('meal', [
          { label: 'Breakfast', value: 'breakfast' },
          { label: 'Lunch', value: 'lunch' },
          { label: 'Snack', value: 'snack' },
          { label: 'Dinner', value: 'dinner' }
        ]))}
        {renderFormField('Rating', '', renderRatingStars(rating, setRating))}
        {renderFormField('Category', 'category', renderSelectField('category', [
          { label: 'Main Course', value: 'mainCourse' },
          { label: 'Side Dish', value: 'sideDish' },
          { label: 'Dessert', value: 'dessert' },
          { label: 'Beverage', value: 'beverage' }
        ]))}
        {renderFormField('Day of the Week', 'day', renderDaySelect())}
        {renderFormField('Your Comments', 'comment', renderTextArea())}
        {renderSubmitButton(submitting)}
      </form>
    </CardContent>
  </Card>
);

// ===== Form Component Renderers =====
/**
 * Renders a form field with label and input
 */
const renderFormField = (label: string, name: string, children: React.ReactNode) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    {children}
  </div>
);

/**
 * Renders a select input field with options
 */
const renderSelectField = (name: string, options: FormOption[]) => (
  <select className="w-full p-2 border rounded-lg focus:ring-blue-500" name={name}>
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

/**
 * Renders the star rating component
 */
const renderRatingStars = (rating: number, setRating: React.Dispatch<React.SetStateAction<number>>) => (
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
);

/**
 * Renders the day selection dropdown
 */
const renderDaySelect = () => (
  <select
    name="day"
    defaultValue={'Monday'}
    className="w-full p-2 border rounded-lg focus:ring-blue-500"
    required
  >
    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
      <option key={day}>{day}</option>
    ))}
  </select>
);

/**
 * Renders the comment textarea
 */
const renderTextArea = () => (
  <textarea 
    className="w-full p-2 border rounded-lg focus:ring-blue-500 min-h-[100px]"
    placeholder="Share your experience..."
    name='comment'
  />
);

/**
 * Renders the submit button
 */
const renderSubmitButton = (submitting: boolean) => (
  <button
    type="submit"
    className={`w-full bg-green-600 text-white py-2 px-4 rounded-lg ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
    disabled={submitting}
  >
    Submit Feedback
  </button>
);

export default FeedbackPage;