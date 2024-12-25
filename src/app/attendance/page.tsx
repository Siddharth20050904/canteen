// src/app/attendance/page.tsx

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MealType {
  id: string;
  name: string;
  time: string;
  status: 'upcoming' | 'marked' | 'missed';
}

const AttendancePage = () => {
  // Sample data - replace with actual data from your backend
  const todayMeals: MealType[] = [
    { id: '1', name: 'Breakfast', time: '7:30 AM - 9:00 AM', status: 'marked' },
    { id: '2', name: 'Lunch', time: '12:30 PM - 2:00 PM', status: 'upcoming' },
    { id: '3', name: 'Dinner', time: '7:30 PM - 9:00 PM', status: 'upcoming' },
  ];

  const attendanceStats = [
    { title: 'Total Meals', value: '45', icon: Users },
    { title: 'Present', value: '38', icon: Clock },
    { title: 'Percentage', value: '84%', icon: Calendar },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'marked':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-gray-600">Mark and track your mess attendance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {attendanceStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Today's Meals */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayMeals.map((meal) => (
                // In the Today's Meals section, update the meal item div structure:
                <div 
                  key={meal.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 space-y-4 sm:space-y-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{meal.name}</h3>
                      <p className="text-sm text-gray-600">{meal.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(meal.status)} sm:text-xs sm:px-2`}>
                      {meal.status.charAt(0).toUpperCase() + meal.status.slice(1)}
                    </span>
                    {meal.status === 'upcoming' && (
                      <>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:px-2 ">
                          Mark Absent
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:px-2">
                          Mark Attendance
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-4 text-left">Date</th>
                    <th className="pb-4 text-left">Meal</th>
                    <th className="pb-4 text-left">Time</th>
                    <th className="pb-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4">Dec {20 - index}, 2024</td>
                      <td className="py-4">Breakfast</td>
                      <td className="py-4">7:30 AM</td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          Present
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AttendancePage;