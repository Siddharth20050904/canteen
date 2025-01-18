"use client";
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { fetchMenuData, DayMenu } from '../../../data/menuData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils } from 'lucide-react';
import Image from 'next/image';

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
    <div className="w-full">
      <div className="grid grid-cols-2 gap-1">
        <div className="text-xs md:text-sm font-medium text-gray-600 bg-green-100 rounded-md text-center p-1">Main Course:</div>
        <div className="text-xs md:text-sm bg-gray-100 rounded-md text-center p-1">{meal.mainCourse || '-'}</div>
        
        <div className="text-xs md:text-sm font-medium text-gray-600 bg-gray-100 rounded-md text-center p-1">Side Dish:</div>
        <div className="text-xs md:text-sm bg-green-100 rounded-md text-center p-1">{meal.sideDish || '-'}</div>
        
        <div className="text-xs md:text-sm font-medium text-gray-600 bg-green-100 rounded-md text-center p-1">Dessert:</div>
        <div className="text-xs md:text-sm bg-gray-100 rounded-md text-center p-1">{meal.dessert || '-'}</div>
        
        <div className="text-xs md:text-sm font-medium text-gray-600 bg-gray-100 rounded-md text-center p-1">Beverage:</div>
        <div className="text-xs md:text-sm bg-green-100 rounded-md text-center p-1">{meal.beverage || '-'}</div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        {/* Page Header */}
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold">Weekly Menu</h1>
          <p className="text-gray-600">View this week&apos;s meal schedule</p>
        </div>

        <main className="max-w-full mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Top Section - Hero Image */}
            <div className="flex justify-center items-start">
              <div className="relative w-full max-w-[400px]">
                <div className="pb-[100%]">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <Image 
                      src="/vectors/timetable.png"
                      alt="Menu Vector"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Cards - Scrollable Container */}
            <div className="lg:col-span-2 h-[calc(100vh-16rem)] overflow-y-auto">
              <div className="space-y-4">
                {Object.entries(weeklyMenuData).map(([day, menu]) => (
                  <Card key={day} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200 pb-3">
                    <CardHeader className="py-2">
                      <CardTitle className="flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-green-800" />
                        {day}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                        {/* Breakfast */}
                        <div>
                          <h3 className="font-medium text-sm lg:text-base text-green-800 mb-2">Breakfast</h3>
                          {renderMeal(menu.breakfast)}
                        </div>

                        {/* Lunch */}
                        <div>
                          <h3 className="font-medium text-sm lg:text-base text-green-800 mb-2">Lunch</h3>
                          {renderMeal(menu.lunch)}
                        </div>

                        {/* Snacks */}
                        <div>
                          <h3 className="font-medium text-sm lg:text-base text-green-800 mb-2">Snacks</h3>
                          {renderMeal(menu.snacks)}
                        </div>

                        {/* Dinner */}
                        <div>
                          <h3 className="font-medium text-sm lg:text-base text-green-800 mb-2">Dinner</h3>
                          {renderMeal(menu.dinner)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default WeeklyMenuPage;
