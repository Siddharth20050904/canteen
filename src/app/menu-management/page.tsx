"use client";
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { addMeal } from '../../../server_actions/mealAddition';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface MenuItemType {
  id: string;
  dish: string;
  category: string;
  day: string;
  mealType: string;
}

const MenuManagementPage = () => {
  const redirect = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<MenuItemType | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setUserType(session?.user?.userType || null);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (userType === 'user') {
      redirect.push('/dashboard');
    }
  }, [userType, redirect]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const newItem: MenuItemType = {
      id: Math.random().toString(),
      dish: form.dish.value,
      category: form.category.value,
      day: form.day.value,
      mealType: form.mealType.value,
    };

    addMeal(newItem);
    setCurrentItem(null);
    form.reset();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        {/* Page Header */}
        <div className='grid grid-cols-1 lg:grid-cols-2 text-center pt-6'>
          <div/>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <div/>
          <p className="text-gray-600">Manage your restaurant&apos;s menu items</p>
        </div>
        <main className="max-w-9xl mx-auto px-4 py-2">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Hero Image */}
            <div className="lg:w-1/2 flex items-start justify-start">
              <div className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] mx-auto">
                <div className="pb-[100%]">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <Image 
                      src="/vectors/management.png"
                      alt="Menu Management Vector"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Menu Form and List */}
            <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="space-y-8">
                {/* Menu Form */}
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlusCircle className="w-5 h-5" />
                      Add New Menu Item
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dish Name
                          </label>
                          <input
                            type="text"
                            name="dish"
                            defaultValue={currentItem?.dish || ''}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter dish name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            name="category"
                            defaultValue={currentItem?.category || ''}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="mainCourse">Main Course</option>
                            <option value="sideDish">Side Dish</option>
                            <option value="dessert">Dessert</option>
                            <option value="beverage">Beverage</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Day of the Week
                          </label>
                          <select
                            name="day"
                            defaultValue={currentItem?.day || ''}
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meal Type
                          </label>
                          <select
                            name="mealType"
                            defaultValue={currentItem?.mealType || ''}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="snacks">Snack</option>
                            <option value="dinner">Dinner</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                      >
                        Add Item
                      </button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default MenuManagementPage;

