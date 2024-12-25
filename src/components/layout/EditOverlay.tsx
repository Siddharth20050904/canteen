// src/components/EditOverlay.tsx
import React from 'react';

type Meal = {
  mainCourse: string;
  sideDish: string;
  dessert: string;
  beverage: string;
};

type EditOverlayProps = {
  meal: Meal;
  onChange: (meal: Meal) => void;
  onSave: () => void;
  onCancel: () => void;
};

const EditOverlay: React.FC<EditOverlayProps> = ({ meal, onChange, onSave, onCancel }) => {
  const handleChange = (field: keyof Meal) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...meal, [field]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Meal</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="mainCourse" className="block text-sm font-medium text-gray-700">
              Main Course
            </label>
            <input
              id="mainCourse"
              type="text"
              value={meal.mainCourse}
              onChange={handleChange('mainCourse')}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter main course"
            />
          </div>
          <div>
            <label htmlFor="sideDish" className="block text-sm font-medium text-gray-700">
              Side Dish
            </label>
            <input
              id="sideDish"
              type="text"
              value={meal.sideDish}
              onChange={handleChange('sideDish')}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter side dish"
            />
          </div>
          <div>
            <label htmlFor="dessert" className="block text-sm font-medium text-gray-700">
              Dessert
            </label>
            <input
              id="dessert"
              type="text"
              value={meal.dessert}
              onChange={handleChange('dessert')}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter dessert"
            />
          </div>
          <div>
            <label htmlFor="beverage" className="block text-sm font-medium text-gray-700">
              Beverage
            </label>
            <input
              id="beverage"
              type="text"
              value={meal.beverage}
              onChange={handleChange('beverage')}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter beverage"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onSave}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOverlay;
