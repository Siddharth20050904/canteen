"use client";

/**
 * @fileoverview Dashboard page component that displays user statistics, today's menu,
 * and recent activity. The dashboard includes attendance tracking, meal counts,
 * reviews given, and a visualization of the day's menu items.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardContentSkeleton } from "@/components/ui/card";
import { Layout } from '@/components/layout/Layout';
import { Calendar, ChefHat, MessageSquare, TrendingUp, Edit3 } from 'lucide-react';

// Server Actions and Data Fetching
import { currentDayMenuData } from '../../../data/menuData';
import { getAttendanceStatsByUserId } from '../../../data/userAttendaneStats';
import { getTotalReviewsByUserId } from '../../../server_actions/fetchRevByUserId';
import { recentActivityByUserId } from '../../../server_actions/logActivity';
import { deletionJobScheduler } from '../../../server_actions/cron-job';

// Type Definitions
interface MenuItem {
  meal: string;
  items: string;
  time: string;
}

interface AttendanceStats {
  present: number;
  total: number;
}

interface ActivityItem {
  activity: string;
  type: string;
  timestamp: string;
}

/**
 * DashboardPage Component
 * 
 * Main dashboard view that displays user statistics, menu information,
 * and recent activity. Handles authentication state and data fetching.
 * 
 * @returns {JSX.Element} The dashboard page component
 */
const DashboardPage = () => {
  // Hooks initialization
  const router = useRouter();
  const session = useSession();

  // State management
  const [todayMenu, setTodayMenu] = useState<MenuItem[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({ present: 0, total: 0 });
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  
  // Loading states
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  /**
   * Initialize deletion job scheduler on component mount
   */
  useEffect(() => {
    deletionJobScheduler();
  }, []);

  /**
   * Fetches today's menu data
   */
  const fetchMenu = useCallback(async () => {
    setLoadingMenu(true);
    try {
      const menuData = await currentDayMenuData();
      setTodayMenu(menuData);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoadingMenu(false);
    }
  }, []);

  /**
   * Fetches user's attendance statistics
   * @param {string} userId - The user's ID
   */
  const fetchAttendanceStats = useCallback(async (userId: string) => {
    setLoadingAttendance(true);
    try {
      const stats = await getAttendanceStatsByUserId(userId);
      setAttendanceStats(stats);
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    } finally {
      setLoadingAttendance(false);
    }
  }, []);

  /**
   * Fetches total number of reviews by user
   * @param {string} userId - The user's ID
   */
  const fetchTotalReviews = useCallback(async (userId: string) => {
    try {
      const totalRev = await getTotalReviewsByUserId(userId);
      setTotalReviews(totalRev);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, []);

  /**
   * Fetches and formats recent user activity
   * @param {string} userId - The user's ID
   */
  const fetchRecentActivity = useCallback(async (userId: string) => {
    setLoadingActivity(true);
    const timeNow = new Date();
    try {
      const activity = await recentActivityByUserId(userId);
      setRecentActivity(activity.slice(0, 3).map(ele => ({
        activity: ele.activity,
        type: ele.type,
        timestamp: formatTimestamp(timeNow, ele.timestamp)
      })));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoadingActivity(false);
    }
  }, []);

  /**
   * Formats timestamp to relative time string
   * @param {Date} now - Current time
   * @param {Date} timestamp - Activity timestamp
   * @returns {string} Formatted relative time
   */
  const formatTimestamp = (now: Date, timestamp: Date): string => {
    if (now.getDate() - timestamp.getDate() > 0) return "1 Day ago";
    if (now.getHours() - timestamp.getHours() > 0) {
      return `${now.getHours() - timestamp.getHours()} hours ago`;
    }
    if (now.getMinutes() - timestamp.getMinutes() > 0) {
      return `${now.getMinutes() - timestamp.getMinutes()} minutes ago`;
    }
    return "Just now";
  };

  // Authentication and initial data fetch
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push('/login');
      return;
    }

    fetchMenu();
  }, [session.status, router, fetchMenu]);

  // Fetch user-specific data when authenticated
  useEffect(() => {
    if (session.status === "authenticated" && session.data?.user?.id) {
      const userId = session.data.user.id;
      fetchAttendanceStats(userId);
      fetchTotalReviews(userId);
      fetchRecentActivity(userId);
    }
  }, [session.status, session.data, fetchAttendanceStats, fetchTotalReviews, fetchRecentActivity]);

  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  /**
   * Renders statistics cards section
   */
  const renderStats = () => {
    const stats = [
      { 
        title: "Attendance", 
        value: `${((attendanceStats.present / attendanceStats.total) * 100).toFixed(2)}%`, 
        icon: Calendar 
      },
      { 
        title: "Reviews Given", 
        value: totalReviews, 
        icon: MessageSquare 
      },
      { 
        title: "Total Meals", 
        value: attendanceStats.present, 
        icon: ChefHat 
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-full bg-green-100">
                <stat.icon className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            {loadingAttendance ? (
              <CardContentSkeleton />
            ) : (
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    );
  };

  /**
   * Renders today's menu section
   */
  const renderTodayMenu = () => (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-100">
            <ChefHat className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-gray-900">Today&apos;s Menu</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loadingMenu ? (
          <CardContentSkeleton />
        ) : (
          <div className="space-y-4">
            {todayMenu.map((item) => (
              <div key={item.meal} className="flex justify-between items-start pb-4 last:pb-0 last:border-0 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.meal}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.items}</p>
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  /**
   * Renders recent activity section
   */
  const renderRecentActivity = () => (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-100">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-gray-900">Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loadingActivity ? (
          <CardContentSkeleton />
        ) : (
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 last:pb-0 last:border-0 border-b border-gray-100">
                  <div className="p-2 rounded-full bg-green-100">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.activity}</h3>
                    <p className="text-sm text-green-600">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No recent activity</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  /**
   * Returns appropriate icon component based on activity type
   * @param {string} type - Activity type
   * @returns {JSX.Element} Icon component
   */
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'feedback':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'suggestion':
        return <Edit3 className="w-5 h-5 text-green-600" />;
      default:
        return <Calendar className="w-5 h-5 text-green-600" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        {/* Page Header */}
        <div className='text-center mb-8 grid grid-cols-1 lg:grid-cols-2 pt-5'>
          <div></div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div></div>
          <p className="text-gray-600">Track your activity and today&apos;s meal</p>
        </div>
        
        <main className="max-w-9xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Hero Image */}
            <div className="lg:w-1/2 flex items-start justify-start">
              <div className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] mx-auto">
                <div className="pb-[100%]">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <Image 
                      src="/vectors/canteen.png"
                      alt="Canteen Vector"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats and Cards */}
            <div className="lg:w-1/2 space-y-8">
              {renderStats()}
              <div className="grid grid-cols-1 gap-6">
                {renderTodayMenu()}
                {renderRecentActivity()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DashboardPage;