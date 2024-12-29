import { fetchMenu } from '../server_actions/menuFetch'; 

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

const defaultMeal: Meal = { mainCourse: "", sideDish: "", dessert: "", beverage: "" };

const initializeWeeklyMenu = (): Record<string, DayMenu> => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weeklyMenu: Record<string, DayMenu> = {};
    daysOfWeek.forEach(day => {
        weeklyMenu[day] = {
            breakfast: { ...defaultMeal },
            lunch: { ...defaultMeal },
            snacks: { ...defaultMeal },
            dinner: { ...defaultMeal },
        };
    });
    return weeklyMenu;
};

export const fetchMenuData = async () => {
    try {
        const menu: { id: number; day: string; mealType: keyof DayMenu; mainCourse: string; sideDish: string; dessert: string; beverage: string; }[] = await fetchMenu() as { id: number; day: string; mealType: keyof DayMenu; mainCourse: string; sideDish: string; dessert: string; beverage: string; }[];
        const formattedMenu: Record<string, DayMenu> = initializeWeeklyMenu();

        menu.forEach((item: { id: number; day: string; mealType: keyof DayMenu; mainCourse: string; sideDish: string; dessert: string; beverage: string }) => {
            formattedMenu[item.day][item.mealType] = {
                mainCourse: item.mainCourse,
                sideDish: item.sideDish,
                dessert: item.dessert,
                beverage: item.beverage,
            };
        });

        console.log(formattedMenu);
        return formattedMenu;
    } catch (error) {
        console.error("Error fetching menu data:", error);
        throw error;
    }
};

const date = new Date();
const day = date.toLocaleDateString('en-US', { weekday: 'long' });
const currentDay = day.charAt(0).toUpperCase() + day.slice(1);

export const currentDayMenuData = async () => {
  try {
      const menu: { id: number; day: string; mealType: keyof DayMenu; mainCourse: string; sideDish: string; dessert: string; beverage: string; }[] = await fetchMenu() as { id: number; day: string; mealType: keyof DayMenu; mainCourse: string; sideDish: string; dessert: string; beverage: string; }[];
      const todayMeals: { meal: string; items: string; time: string }[] = [];

      menu.forEach((item: { id: number; day: string; mealType: keyof DayMenu; mainCourse: string; sideDish: string; dessert: string; beverage: string }) => {
          if (item.day === currentDay) {
              todayMeals.push({
                  meal: item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1),
                  items: `${item.mainCourse ? item.mainCourse : ''}${item.sideDish ? ', ' + item.sideDish : ''}${item.dessert ? ', ' + item.dessert : ''}${item.beverage ? ', ' + item.beverage : ''}`,
                  time: item.mealType === 'breakfast' ? '8:00 AM' : item.mealType === 'lunch' ? '12:00 PM' : item.mealType === 'snacks' ? '17:00 PM' : '20:00 PM'              });
          }
      });
      return todayMeals;
  } catch (error) {
      console.error("Error fetching current day menu data:", error);
      throw error;
  }
};