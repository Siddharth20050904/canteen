// src/app/menu-management/page.tsx
"use client";
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import { addMeal } from '../../../server_actions/mealAddition';

interface MenuItemType {
  id: string;
  dish: string;
  category: string;
  day: string;
  mealType: string;
}

const MenuManagementPage = () => {
  // Sample menu items data - replace with actual data from your backend
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([
    {
      id: '1',
      dish: 'Paneer Butter Masala',
      category: 'Main Course',
      day: 'Monday',
      mealType: 'Lunch',
    },
    {
      id: '2',
      dish: 'Mixed Fruit Salad',
      category: 'Dessert',
      day: 'Wednesday',
      mealType: 'Snack',
    },
  ]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<MenuItemType | null>(null);

  const handleEdit = (item: MenuItemType) => {
    setIsEditing(true);
    setCurrentItem(item);
  };

  const handleDelete = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const newItem: MenuItemType = {
      id: currentItem ? currentItem.id : (menuItems.length + 1).toString(),
      dish: form.dish.value,
      category: form.category.value,
      day: form.day.value,
      mealType: form.mealType.value,
    };

    if (currentItem) {
      setMenuItems(menuItems.map(item => (item.id === currentItem.id ? newItem : item)));
    } else {
      setMenuItems([...menuItems, newItem]);
    }

    addMeal(newItem);
    
    setIsEditing(false);
    setCurrentItem(null);
    form.reset();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant&apos;s menu items</p>
        </div>

        {/* Menu Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
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
                    <option value={"breakfast"}>Breakfast</option>
                    <option value={"lunch"}>Lunch</option>
                    <option value={"snacks"}>Snack</option>
                    <option value={"dinner"}>Dinner</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {isEditing ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Menu Items List */}
        <div className="space-y-4">
          {menuItems.map(item => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">{item.dish}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.day}</span>
                      <span>•</span>
                      <span>{item.mealType}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MenuManagementPage;
