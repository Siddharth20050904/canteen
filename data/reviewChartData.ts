"use server";
import { fetchReviews } from '../server_actions/reviewFetch';

export const getReviewData = async () => {
  try {
    const fetchedData = await fetchReviews();
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const currentWeekReviews = fetchedData.filter((review) => {
      const reviewDate = new Date(review.createdAt);
      return reviewDate >= startOfWeek;
    });

    if (!currentWeekReviews || currentWeekReviews.length === 0) {
      throw new Error('No reviews fetched for current week');
    }

    return currentWeekReviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const PieData = async () => {
  const reviewData = await getReviewData();

  if (reviewData.length === 0) {
    return { posRev: 0, negRev: 0, neuRev: 0 };
  }

  const positiveReviews = reviewData.filter((review) => review.rating > 3);
  const negativeReviews = reviewData.filter((review) => review.rating < 2);
  const neutralReviews = reviewData.filter((review) => review.rating >= 2 && review.rating <= 3);

  const totalReviews = reviewData.length;

  const posRev = (positiveReviews.length / totalReviews) * 100;
  const negRev = (negativeReviews.length / totalReviews) * 100;
  const neuRev = (neutralReviews.length / totalReviews) * 100;

  return { posRev, negRev, neuRev };
};
