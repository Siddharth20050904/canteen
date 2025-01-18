"use client";

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { addMeal } from '../../../server_actions/mealAddition';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define types
interface MenuItemType {
  id: string;
  dish: string;
  category: string;
  day: string;
  mealType: string;
}

const MenuManagementPage = () => {
  const [currentItem, setCurrentItem] = useState<MenuItemType | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const router = useRouter();

  // Authentication check
  useEffect(() => {
    const checkUserAuth = async () => {
      const session = await getSession();
      const userType = session?.user?.userType || null;

      if (userType === 'user') {
        router.push('/dashboard');
      }
    };

    checkUserAuth();
  }, [router]);

  // Form submission handler
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const form = event.currentTarget;
    const newItem: MenuItemType = {
      id: Math.random().toString(),
      dish: form.dish.value,
      category: form.category.value,
      day: form.day.value,
      mealType: form.mealType.value,
    };

    try {
      await addMeal(newItem);
      showToast('Meal added successfully', 'success');
    } catch (error) {
      showToast('Failed to add meal', 'error');
      console.error(error);
    } finally {
      setIsPosting(false);
      setCurrentItem(null);
      form.reset();
    }
  };

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // UI Components
  const PageHeader = () => (
    <div className='grid grid-cols-1 lg:grid-cols-2 text-center pt-6'>
      <div/>
      <h1 className="text-2xl font-bold">Menu Management</h1>
      <div/>
      <p className="text-gray-600">Manage your restaurant&apos;s menu items</p>
    </div>
  );

  const HeroImage = () => (
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
  );

  const MenuForm = () => (
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
            <FormInput
              label="Dish Name"
              name="dish"
              type="text"
              placeholder="Enter dish name"
              defaultValue={currentItem?.dish}
            />
            <FormSelect
              label="Category"
              name="category"
              options={[
                { value: "mainCourse", label: "Main Course" },
                { value: "sideDish", label: "Side Dish" },
                { value: "dessert", label: "Dessert" },
                { value: "beverage", label: "Beverage" },
              ]}
              defaultValue={currentItem?.category}
            />
            <FormSelect
              label="Day of the Week"
              name="day"
              options={[
                "Monday", "Tuesday", "Wednesday", "Thursday",
                "Friday", "Saturday", "Sunday"
              ].map(day => ({ value: day, label: day }))}
              defaultValue={currentItem?.day}
            />
            <FormSelect
              label="Meal Type"
              name="mealType"
              options={[
                { value: "breakfast", label: "Breakfast" },
                { value: "lunch", label: "Lunch" },
                { value: "snacks", label: "Snack" },
                { value: "dinner", label: "Dinner" },
              ]}
              defaultValue={currentItem?.mealType}
            />
          </div>
          <button
            type="submit"
            className={`bg-green-600 text-white py-2 px-4 rounded-lg ${
              isPosting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
            disabled={isPosting}
          > 
            Add Item
          </button>
        </form>
      </CardContent>
    </Card>
  );

  // Reusable form components
  const FormInput = ({ label, name, type, placeholder, defaultValue }: {
    label: string;
    name: string;
    type: string;
    placeholder: string;
    defaultValue?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue || ''}
        className="w-full p-2 border rounded-lg"
        placeholder={placeholder}
        required
      />
    </div>
  );

  const FormSelect = ({ label, name, options, defaultValue }: {
    label: string;
    name: string;
    options: { value: string; label: string }[];
    defaultValue?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        defaultValue={defaultValue || ''}
        className="w-full p-2 border rounded-lg"
        required
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        <PageHeader />
        <main className="max-w-9xl mx-auto px-4 py-2">
          <div className="flex flex-col lg:flex-row gap-8">
            <HeroImage />
            <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="space-y-8">
                <MenuForm />
              </div>
            </div>
          </div>
        </main>
      </div>
      <ToastContainer/>
    </Layout>
  );
};

export default MenuManagementPage;

