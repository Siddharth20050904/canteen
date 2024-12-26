"use server";
import { fetchReviews } from '../server_actions/reviewFetch';

interface Review {
  mealType: string;
  rating: number;
  category: string;
  comment?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  day : string;
}

interface ReviewStats {
  posRev: number;
  negRev: number;
  neuRev: number;
}

interface MealReviewStats {
  mainCourse: ReviewStats;
  sideDish: ReviewStats;
  dessert: ReviewStats;
  beverage: ReviewStats;
}

export interface DayReviewStats {
  day: string;
  breakfast: MealReviewStats;
  lunch: MealReviewStats;
  snack: MealReviewStats;
  dinner: MealReviewStats;
}

const initializeReviewStats = (): ReviewStats => ({
  posRev: 0,
  negRev: 0,
  neuRev: 0,
});

const initializeMealReviewStats = (): MealReviewStats => ({
  mainCourse: initializeReviewStats(),
  sideDish: initializeReviewStats(),
  dessert: initializeReviewStats(),
  beverage: initializeReviewStats(),
});

const initializeDayReviewStats = (day: string): DayReviewStats => ({
  day,
  breakfast: initializeMealReviewStats(),
  lunch: initializeMealReviewStats(),
  snack: initializeMealReviewStats(),
  dinner: initializeMealReviewStats(),
});

export const getBarPlotData = async (): Promise<DayReviewStats[]> => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const barPlotData: DayReviewStats[] = daysOfWeek.map(initializeDayReviewStats);

  try {
    const reviews: Review[] = await fetchReviews();

    reviews.forEach((review) => {
      const dayIndex = review.day.toLowerCase() === 'sunday' ? 0 : review.day.toLowerCase() === 'monday' ? 1 : review.day.toLowerCase() === 'tuesday' ? 2 : review.day.toLowerCase() === 'wednesday' ? 3 : review.day.toLowerCase() === 'thursday' ? 4 : review.day.toLowerCase() === 'friday' ? 5 : 6;
      const dayReviewStats = barPlotData[dayIndex];

      const mealType = review.mealType.toLowerCase() as keyof DayReviewStats;
      const categoryMapping: { [key: string]: keyof MealReviewStats } = {
        maincourse: 'mainCourse',
        sidedish: 'sideDish',
        dessert: 'dessert',
        beverage: 'beverage'
      };
      const category = categoryMapping[review.category.toLowerCase()] as keyof MealReviewStats;

      if (dayReviewStats[mealType] && typeof dayReviewStats[mealType] !== 'string') {
        const mealStats = dayReviewStats[mealType] as MealReviewStats;
        if (category in mealStats) {
          if (review.rating > 3) {
            mealStats[category].posRev += 1;
          } else if (review.rating < 2) {
            mealStats[category].negRev += 1;
          } else {
            mealStats[category].neuRev += 1;
          }
        }
      }
    });
    
    return barPlotData;
  } catch (error) {
    console.error('Error processing review data:', error);
    throw error;
  }
};
