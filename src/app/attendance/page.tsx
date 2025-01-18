"use client";

import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Clock, Calendar, Check, Percent, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardContentSkeleton } from '@/components/ui/card';
import { currentDayMenuData } from '../../../data/menuData';
import { markAttendance } from '../../../server_actions/attendance';
import { useSession } from 'next-auth/react';
import { getTodayAttendance } from '../../../data/getTodayAttendance';
import { Attendance } from '@prisma/client';
import { getAttendanceStatsByUserId } from '../../../data/userAttendaneStats';
import { logActivity } from '../../../server_actions/logActivity';
import Image from 'next/image';

// ===== Type Definitions =====
interface MealType {
  id: string;
  name: string;
  time: string;
  status: 'upcoming' | 'marked' | 'missed';
}

interface AttendanceStats {
  present: number;
  total: number;
}

/**
 * AttendancePage Component
 * 
 * A comprehensive page component for managing meal attendance.
 * Features include:
 * - Displaying daily meals
 * - Marking attendance
 * - Showing attendance statistics
 * - Real-time status updates
 */
const AttendancePage = () => {
  // ===== State Management =====
  const [todayMeals, setTodayMeals] = useState<MealType[]>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({ present: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  // ===== Utility Functions =====
  /**
   * Determines the status of a meal based on its scheduled time
   * @param mealTime - Time of the meal in HH:mm format
   */
  const getMealStatus = useCallback((mealTime: string): 'upcoming' | 'marked' | 'missed' => {
    const now = new Date();
    const [hours] = mealTime.split(':').map(Number);
    const mealDateTime = new Date();
    mealDateTime.setHours(hours);

    // Add 2 hour buffer after meal time
    const bufferTime = new Date(mealDateTime.getTime() + 60 * 60 * 2000);

    if (now > bufferTime) {
      return 'missed';
    } else if (now < mealDateTime) {
      return 'upcoming';
    }
    
    return 'upcoming';
  }, []);

  // ===== Data Fetching Functions =====
  /**
   * Fetches and formats the daily menu data
   */
  const fetchMenuData = useCallback(async () => {
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
    } finally {
      setLoading(false);
    }
  }, [getMealStatus]);

  /**
   * Fetches attendance status for a specific user
   * @param userId - ID of the user
   */
  const fetchAttendanceStatus = useCallback(async (userId: string) => {
    try {
      setLoadingAttendance(true);
      const attend = await getTodayAttendance(userId);
      setAttendance(attend.map(a => ({
        id: a.id,
        userId: userId,
        mealId: a.mealId,
        status: a.status,
        markedAt: a.markedAt
      })));
    
      // Update meal status based on attendance records
      setTodayMeals(currentMeals => 
        currentMeals.map(meal => ({
          ...meal,
          status: attend.some(a => a.mealId === meal.id) ? 'marked' : meal.status
        }))
      );
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoadingAttendance(false);
    }
  }, []);

  /**
   * Fetches attendance statistics for a specific user
   * @param userId - ID of the user
   */
  const fetchAttendanceStats = useCallback(async (userId: string) => {
    try {
      const stats = await getAttendanceStatsByUserId(userId);
      setAttendanceStats(stats);
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    }
  }, []);

  // ===== Effect Hooks =====
  // Initialize menu data
  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  // Load user-specific data when userId is available
  useEffect(() => {
    if (userId) {
      fetchAttendanceStatus(userId);
      fetchAttendanceStats(userId);
    }
  }, [userId, fetchAttendanceStatus, fetchAttendanceStats]);

  // ===== Event Handlers =====
  /**
   * Handles marking attendance for a specific meal
   * @param mealId - ID of the meal
   * @param status - Attendance status (present/absent)
   */
  const handleMarkAttendance = async (mealId: string, status: 'present' | 'absent') => {
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }

    // Optimistic update
    const previousMeals = [...todayMeals];
    setTodayMeals(prevMeals => 
      prevMeals.map(meal => 
        meal.id === mealId 
          ? { ...meal, status: status === 'present' ? 'marked' : 'missed' }
          : meal
      )
    );

    try {
      await markAttendance(userId, mealId, status);
      await logActivity(userId, `Marked attendance for ${mealId} as ${status}`, 'attendance');
      await fetchAttendanceStats(userId);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      setTodayMeals(previousMeals); // Revert on error
    }
  };

  // ===== UI Helper Functions =====
  /**
   * Determines the color scheme for meal status display
   */
  const getStatusColor = (meal: MealType, attendance: Attendance[]) => {
    const attendanceRecord = attendance.find(a => a.mealId === meal.id);
    
    if (attendanceRecord) {
      return attendanceRecord.status === 'absent' 
        ? 'bg-red-100 text-red-800'
        : 'bg-green-100 text-green-800';
    }
    
    switch (meal.status) {
      case 'marked':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-600';
    }
  };

  // ===== Render Components =====
  /**
   * Renders attendance statistics cards
   */
  const renderStats = () => {
    const stats = [
      { title: 'Total Meal', value: `${attendanceStats.total}`, icon: Calendar },
      { title: 'Meals Present', value: `${attendanceStats.present}`, icon: Check },
      { title: 'Attendance %', value: `${((attendanceStats.present/attendanceStats.total)*100).toFixed(2)}%`, icon: Percent },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className='bg-white shadow-md hover:shadow-lg transition-shadow duration-200'>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-green-600" />
            </CardHeader>
            {loadingAttendance ? (
              <CardContentSkeleton />
            ) : (
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    );
  };

  /**
   * Renders the meals list with attendance marking functionality
   */
  const renderMeals = () => (
    <Card className='bg-white shadow-md hover:shadow-lg transition-shadow duration-200'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="w-5 h-5" />
          Mark Attendance
        </CardTitle>
      </CardHeader>
      {loading ? (
        <CardContentSkeleton />
      ) : (
        <CardContent>
          <div className="space-y-4">
            {todayMeals.map((meal) => (
              <div 
                key={meal.id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:shadow-lg space-y-4 sm:space-y-0"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{meal.name}</h3>
                    <p className="text-sm text-green-600">{meal.time}</p>
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
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:px-2"
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
      )}
    </Card>
  );

  // ===== Main Render =====
  return (
    <Layout>
      <div className="space-y-6 bg-gradient-to-br from-green-50 to-gray-50">
        {/* Page Header */}
        <div className='text-center mb-8 grid grid-cols-1 md:grid-cols-2'>
          <div></div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <div></div>
          <p className="text-gray-600">Mark and track your mess attendance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Hero Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[300px] md:max-w-[400px] mx-auto">
              <div className="pb-[100%]">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Image 
                    src="/vectors/attendance.png"
                    alt="Attendance Vector"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Meals */}
          <div className="space-y-6">
            {renderStats()}
            {renderMeals()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AttendancePage;