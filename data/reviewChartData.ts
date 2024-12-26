import { useEffect, useState } from 'react';
import { fetchReviews } from '../server_actions/reviewFetch';

const ReviewDataFetcher = () => {
    const [reviewData, setReviewData] = useState([]);

    useEffect(() => {
      const fetchReviewData = async () => {
        try {
          const fetchedData = await fetchReviews();
          const currentDate = new Date();
          const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
          startOfWeek.setHours(0, 0, 0, 0);
          
          const currentWeekReviews = fetchedData.filter((review: { createdAt: string | number | Date; }) => {
            const reviewDate = new Date(review.createdAt);
            return reviewDate >= startOfWeek;
          });
          
          setReviewData(currentWeekReviews as React.SetStateAction<never[]>);
          if (!currentWeekReviews || currentWeekReviews.length === 0) {
            throw new Error('No reviews fetched for current week');
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };

      fetchReviewData();
    }, []);

    return reviewData;
};
export const PieData = () => {
    const [posRev, setPosRev] = useState(0);
    const [negRev, setNegRev] = useState(0);
    const [neuRev, setNeuRev] = useState(0);

    const reviewData = ReviewDataFetcher();
    
    useEffect(() => {
        if (reviewData.length > 0) {
            const positiveReviews = reviewData.filter((review: { rating: number }) => review.rating > 3);
            const negativeReviews = reviewData.filter((review: { rating: number }) => review.rating < 2);
            const neutralReviews = reviewData.filter((review: { rating: number }) => review.rating >= 2 && review.rating <= 3);

            setPosRev((positiveReviews.length / reviewData.length) * 100);
            setNegRev((negativeReviews.length / reviewData.length) * 100);
            setNeuRev((neutralReviews.length / reviewData.length) * 100);
        }
    }, [reviewData]);

    return { posRev, negRev, neuRev };
}