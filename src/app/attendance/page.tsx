// src/app/attendance/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Clock, Calendar, Check, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currentDayMenuData } from '../../../data/menuData';
import { markAttendance } from '../../../server_actions/attendance';
import { useSession } from 'next-auth/react';
import { getTodayAttendance } from '../../../data/getTodayAttendance';
import { Attendance } from '@prisma/client';
import { getAttendanceStatsByUserId } from '../../../data/userAttendaneStats';
import { logActivity } from '../../../server_actions/logActivity';

interface MealType {
  id: string;
  name: string;
  time: string;
  status: 'upcoming' | 'marked' | 'missed';
}

const AttendancePage = () => {
  const [todayMeals, setTodayMeals] = useState<MealType[]>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, total: 0 });

  const getMealStatus = (mealTime: string): 'upcoming' | 'marked' | 'missed' => {
    const now = new Date();
    const [hours] = mealTime.split(':').map(Number);
    console.log(hours);
    const mealDateTime = new Date();
    mealDateTime.setHours(hours);

    // Add 1 hour buffer after meal time
    const bufferTime = new Date(mealDateTime.getTime() + 60 * 60 * 2000);

    if (now > bufferTime) {
      return 'missed';
    } else if (now < mealDateTime) {
      return 'upcoming';
    }
    
    return 'upcoming';
  };


  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const menuData = await currentDayMenuData();
        const formattedMenuData: MealType[] = menuData.map((meal, index) => ({
          id: `meal-${index + 1}`,
          name: meal.meal,
          time: meal.time,
          status: getMealStatus(meal.time)
        }));
        setTodayMeals(formattedMenuData);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };
    fetchMenuData();
  }, []);

  useEffect(() => {
    const getAttendanceStatus = async (userId: string) => {
      try {
        const attend = await getTodayAttendance(userId);
        setAttendance(attend.map(a => ({
          id: a.id,
          userId: userId,
          mealId: a.mealId,
          status: a.status,
          markedAt: a.markedAt
        })));
      
        setTodayMeals(currentMeals => 
          currentMeals.map(meal => ({
            ...meal,
            status: attend.some(a => a.mealId === meal.id) ? 'marked' : meal.status
          }))
        );
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };    
    if (userId) {
      getAttendanceStatus(userId);
    }
  }, [userId]);

  useEffect(() => {
    const fetchAttendance = async (userId: string) => {
      try {
        const stats = await getAttendanceStatsByUserId(userId);
        setAttendanceStats(stats);
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      }
    };
    if (userId) {
      fetchAttendance(userId);
    }
  }, [userId]);

  const stats = [
    { title: 'Total Meal', value: `${attendanceStats.total}`, icon: Calendar },
    { title: 'Meals Present', value: `${attendanceStats.present}`, icon: Check },
    { title: 'Attendance %', value: `${((attendanceStats.present/attendanceStats.total)*100).toFixed(2) }`, icon: Percent },
  ];

  const getStatusColor = (meal: MealType, attendance: Attendance[]) => {
    const attendanceRecord = attendance.find(a => a.mealId === meal.id);
    
    if (attendanceRecord) {
      return attendanceRecord.status === 'absent' 
        ? 'bg-red-100 text-red-800'
        : 'bg-green-100 text-green-800';
    }
    
    switch (status) {
      case 'marked':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleMarkAttendance = async (mealId: string, status: 'present' | 'absent') => {
    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error('User ID is undefined');
      }
      await markAttendance(userId, mealId, status);

      await logActivity(userId, `Marked attendance for ${mealId} as ${status}`, 'attendance');

      // Update local state to reflect the change
      setTodayMeals(prevMeals => 
        prevMeals.map(meal => 
          meal.id === mealId 
            ? { ...meal, status: status === 'present' ? 'marked' : 'missed' }
            : meal
        )
      );
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      // Add error handling UI feedback here
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
          {stats.map((stat) => (
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
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(meal, attendance)} sm:text-xs sm:px-2`}>
                      {meal.status.charAt(0).toUpperCase() + meal.status.slice(1)}
                    </span>
                      {meal.status === 'upcoming' && (
                        <div className="flex items-center gap-2">
                          {attendance.find(a => a.mealId === meal.id && a.status === 'present') ? (
                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                              Present
                            </span>
                          ) : attendance.find(a => a.mealId === meal.id && a.status === 'absent') ? (
                            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                              Absent
                            </span>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleMarkAttendance(meal.id, 'absent')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:px-2"
                              >
                                Mark Absent
                              </button>
                              <button
                                onClick={() => handleMarkAttendance(meal.id, 'present')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:px-2"
                              >
                                Mark Attendance
                              </button>
                            </>
                          )}
                        </div>
                      )}

                    {meal.status === 'missed' && (
                      <span className="text-sm text-red-600">Time elapsed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AttendancePage;