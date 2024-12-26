// src/app/weekly-menu/page.tsx
"use client";
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { fetchMenuData, DayMenu, Meal } from '../../../data/menuData';
import EditOverlay from '@/components/layout/EditOverlay';

const WeeklyMenuPage = () => {
  const [editing, setEditing] = useState<{ day: string, mealType: string } | null>(null);
  const [meal, setMeal] = useState<Meal>({ mainCourse: '', sideDish: '', dessert: '', beverage: '' });
  const [weeklyMenuData, setWeeklyMenuData] = useState({} as Record<string, DayMenu>);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMenuData();
      setWeeklyMenuData(data);
    };
    fetchData();
  }, []);

  const handleEditClick = (day: string, mealType: string, meal: Meal) => {
    setEditing({ day, mealType });
    setMeal(meal);
  };

  const handleSave = () => {
    if (editing) {
      const { day, mealType } = editing;
      setWeeklyMenuData(prevMenu => ({
        ...prevMenu,
        [day]: {
          ...prevMenu[day],
          [mealType]: meal
        }
      }));
      setEditing(null);
    }
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const renderMeal = (meal: DayMenu[keyof DayMenu], day: string, mealType: string) => (
    <table className="min-w-full bg-white border">
      <tbody>
        <tr>
          <td className="border px-4 py-2 font-bold">Main Course</td>
          <td className="border px-4 py-2">{meal.mainCourse}</td>
          <td className="border px-4 py-2">
            <button onClick={() => handleEditClick(day, mealType, meal)} className="text-blue-500 hover:underline">Edit</button>
          </td>
        </tr>
        <tr>
          <td className="border px-4 py-2 font-bold">Side Dish</td>
          <td className="border px-4 py-2">{meal.sideDish}</td>
          <td className="border px-4 py-2">
            <button onClick={() => handleEditClick(day, mealType, meal)} className="text-blue-500 hover:underline">Edit</button>
          </td>
        </tr>
        <tr>
          <td className="border px-4 py-2 font-bold">Dessert</td>
          <td className="border px-4 py-2">{meal.dessert}</td>
          <td className="border px-4 py-2">
            <button onClick={() => handleEditClick(day, mealType, meal)} className="text-blue-500 hover:underline">Edit</button>
          </td>
        </tr>
        <tr>
          <td className="border px-4 py-2 font-bold">Beverage</td>
          <td className="border px-4 py-2">{meal.beverage}</td>
          <td className="border px-4 py-2">
            <button onClick={() => handleEditClick(day, mealType, meal)} className="text-blue-500 hover:underline">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <Layout>
      <div className="container mx-auto my-8">
        <h1 className="text-4xl font-bold text-center mb-8">Weekly Menu</h1>
        {editing && (
          <EditOverlay
            meal={meal}
            onChange={setMeal}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Day</th>
                <th className="border px-4 py-2">Breakfast</th>
                <th className="border px-4 py-2">Lunch</th>
                <th className="border px-4 py-2">Snacks</th>
                <th className="border px-4 py-2">Dinner</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(weeklyMenuData).map(([day, menu]) => (
                <tr key={day}>
                  <td className="border px-4 py-2 font-bold">{day}</td>
                  <td className="border px-4 py-2">{renderMeal(menu.breakfast, day, 'breakfast')}</td>
                  <td className="border px-4 py-2">{renderMeal(menu.lunch, day, 'lunch')}</td>
                  <td className="border px-4 py-2">{renderMeal(menu.snacks, day, 'snacks')}</td>
                  <td className="border px-4 py-2">{renderMeal(menu.dinner, day, 'dinner')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default WeeklyMenuPage;
