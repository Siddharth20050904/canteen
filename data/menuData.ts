// src/app/menuData.ts
export type Meal = {
    mainCourse: string;
    sideDish: string;
    dessert: string;
    beverage: string;
  };
  
  export type DayMenu = {
    breakfast: Meal;
    lunch: Meal;
    snacks: Meal;
    dinner: Meal;
  };
  
  export const weeklyMenu: Record<string, DayMenu> = {
    Monday: {
      breakfast: { mainCourse: "Pancakes", sideDish: "Bacon", dessert: "Fruit Salad", beverage: "Orange Juice" },
      lunch: { mainCourse: "Chicken Sandwich", sideDish: "Fries", dessert: "Ice Cream", beverage: "Soda" },
      snacks: { mainCourse: "Granola Bar", sideDish: "Yogurt", dessert: "Cookies", beverage: "Milk" },
      dinner: { mainCourse: "Steak", sideDish: "Mashed Potatoes", dessert: "Cake", beverage: "Wine" },
    },
    Tuesday: {
        breakfast: { mainCourse: "Pancakes", sideDish: "Bacon", dessert: "Fruit Salad", beverage: "Orange Juice" },
        lunch: { mainCourse: "Chicken Sandwich", sideDish: "Fries", dessert: "Ice Cream", beverage: "Soda" },
        snacks: { mainCourse: "Granola Bar", sideDish: "Yogurt", dessert: "Cookies", beverage: "Milk" },
        dinner: { mainCourse: "Steak", sideDish: "Mashed Potatoes", dessert: "Cake", beverage: "Wine" },
    },
    Wednesday: {
        breakfast: { mainCourse: "Pancakes", sideDish: "Bacon", dessert: "Fruit Salad", beverage: "Orange Juice" },
        lunch: { mainCourse: "Chicken Sandwich", sideDish: "Fries", dessert: "Ice Cream", beverage: "Soda" },
        snacks: { mainCourse: "Granola Bar", sideDish: "Yogurt", dessert: "Cookies", beverage: "Milk" },
        dinner: { mainCourse: "Steak", sideDish: "Mashed Potatoes", dessert: "Cake", beverage: "Wine" },
    },
    Thursday: {
        breakfast: { mainCourse: "Pancakes", sideDish: "Bacon", dessert: "Fruit Salad", beverage: "Orange Juice" },
        lunch: { mainCourse: "Chicken Sandwich", sideDish: "Fries", dessert: "Ice Cream", beverage: "Soda" },
        snacks: { mainCourse: "Granola Bar", sideDish: "Yogurt", dessert: "Cookies", beverage: "Milk" },
        dinner: { mainCourse: "Steak", sideDish: "Mashed Potatoes", dessert: "Cake", beverage: "Wine" },
    },
    Friday: {
    breakfast: { mainCourse: "Pancakes", sideDish: "Bacon", dessert: "Fruit Salad", beverage: "Orange Juice" },
    lunch: { mainCourse: "Chicken Sandwich", sideDish: "Fries", dessert: "Ice Cream", beverage: "Soda" },
    snacks: { mainCourse: "Granola Bar", sideDish: "Yogurt", dessert: "Cookies", beverage: "Milk" },
    dinner: { mainCourse: "Steak", sideDish: "Mashed Potatoes", dessert: "Cake", beverage: "Wine" },
    },
    Saturday: {
        breakfast: { mainCourse: "Pancakes", sideDish: "Bacon", dessert: "Fruit Salad", beverage: "Orange Juice" },
        lunch: { mainCourse: "Chicken Sandwich", sideDish: "Fries", dessert: "Ice Cream", beverage: "Soda" },
        snacks: { mainCourse: "Granola Bar", sideDish: "Yogurt", dessert: "Cookies", beverage: "Milk" },
        dinner: { mainCourse: "Steak", sideDish: "Mashed Potatoes", dessert: "Cake", beverage: "Wine" },
    },
    Sunday: {
        breakfast: { mainCourse: "Pancakes", sideDish: "Bacon", dessert: "Fruit Salad", beverage: "Orange Juice" },
        lunch: { mainCourse: "Chicken Sandwich", sideDish: "Fries", dessert: "Ice Cream", beverage: "Soda" },
        snacks: { mainCourse: "Granola Bar", sideDish: "Yogurt", dessert: "Cookies", beverage: "Milk" },
        dinner: { mainCourse: "Steak", sideDish: "Mashed Potatoes", dessert: "Cake", beverage: "Wine" },
    }
    // Repeat for the rest of the week (Tuesday to Sunday)
    // Add the other days' data here
  };
  