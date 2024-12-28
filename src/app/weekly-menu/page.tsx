// src/app/weekly-menu/page.tsx
"use client";
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { fetchMenuData, DayMenu } from '../../../data/menuData';

const WeeklyMenuPage = () => {
  const [weeklyMenuData, setWeeklyMenuData] = useState({} as Record<string, DayMenu>);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMenuData();
      setWeeklyMenuData(data);
    };
    fetchData();
  }, []);

  const renderMeal = (meal: DayMenu[keyof DayMenu]) => (
    <table className="min-w-full bg-white border">
      <tbody>
        <tr>
          <td className="border px-4 py-2 font-bold">Main Course</td>
          <td className="border px-4 py-2">{meal.mainCourse}</td>
        </tr>
        <tr>
          <td className="border px-4 py-2 font-bold">Side Dish</td>
          <td className="border px-4 py-2">{meal.sideDish}</td>
        </tr>
        <tr>
          <td className="border px-4 py-2 font-bold">Dessert</td>
          <td className="border px-4 py-2">{meal.dessert}</td>
        </tr>
        <tr>
          <td className="border px-4 py-2 font-bold">Beverage</td>
          <td className="border px-4 py-2">{meal.beverage}</td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <Layout>
      <div className="container mx-auto my-8">
        <h1 className="text-4xl font-bold text-center mb-8">Weekly Menu</h1>
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
                  <td className="border px-4 py-2">{renderMeal(menu.breakfast)}</td>
                  <td className="border px-4 py-2">{renderMeal(menu.lunch)}</td>
                  <td className="border px-4 py-2">{renderMeal(menu.snacks)}</td>
                  <td className="border px-4 py-2">{renderMeal(menu.dinner)}</td>
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
