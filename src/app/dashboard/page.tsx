"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChefHat, MessageSquare, TrendingUp, Edit3 } from "lucide-react";
import { Layout } from '@/components/layout/Layout';
import { currentDayMenuData } from '../../../data/menuData';
import { getAttendanceStatsByUserId } from '../../../data/userAttendaneStats';
import { getTotalReviewsByUserId } from '../../../server_actions/fetchRevByUserId';
import { recentActivityByUserId } from '../../../server_actions/logActivity';
import { deletionJobScheduler } from '../../../server_actions/cron-job';

const DashboardPage = () => {
  const router = useRouter();
  const session = useSession();
  const [todayMenu, setTodayMenu] = React.useState<{ meal: string; items: string; time: string }[]>([]);
  const [attendanceStats, setAttendanceStats] = React.useState<{ present: number; total: number }>({ present: 0, total: 0 });
  const [totalReviews, setTotalReviews] = React.useState<number>(0);
  const [recentActivity, setRecentActivity] = React.useState<{ activity: string; type: string; timestamp: string }[]>([]);
  const [loadingMenu, setLoadingMenu] = React.useState(true);
  const [loadingAttendance, setLoadingAttendance] = React.useState(true);
  const [loadingActivity, setLoadingActivity] = React.useState(true);

  useEffect(() => {
    deletionJobScheduler();
  }, []);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push('/login');
      return;
    }

    const fetchMenu = async () => {
      setLoadingMenu(true);
      try {
        const menuData = await currentDayMenuData();
        setTodayMenu(menuData);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenu();
  }, [session.status, router]);

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      setLoadingAttendance(true);
      try {
        if (session.status === "authenticated") {
          const userId = session.data.user.id; // Replace with the actual user ID
          const stats = await getAttendanceStatsByUserId(userId);
          setAttendanceStats(stats);
        }
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      } finally {
        setLoadingAttendance(false);
      }
    };
    fetchAttendanceStats();
  }, [session.status, session.data]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (session.status === "authenticated") {
          const userId = session.data.user.id; // Replace with the actual user ID
          const totalRev = await getTotalReviewsByUserId(userId);
          setTotalReviews(totalRev);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchUser();
  }, [session.status, session.data]);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      setLoadingActivity(true);
      const timeNow = new Date();
      try {
        if (session.status === "authenticated") {
          const userId = session.data.user.id; // Replace with the actual user ID
          const activity = await recentActivityByUserId(userId);
          setRecentActivity(activity.slice(0, 3).map(ele => ({
            activity: ele.activity,
            type: ele.type,
            timestamp: (timeNow.getDate() - ele.timestamp.getDate() > 0 ? "1 Day ago" : (timeNow.getHours() - ele.timestamp.getHours() > 0 ? timeNow.getHours() - ele.timestamp.getHours() + " hours ago" : (timeNow.getMinutes() - ele.timestamp.getMinutes() > 0 ? timeNow.getMinutes() - ele.timestamp.getMinutes() + " minutes ago" : "Just now")))
          })));
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoadingActivity(false);
      }
    };
    fetchRecentActivity();
  }, [session.status, session.data]);

  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  const stats = [
    { title: "Attendance", value: `${((attendanceStats.present / attendanceStats.total) * 100).toFixed(2)}%`, icon: Calendar },
    { title: "Reviews Given", value: totalReviews, icon: MessageSquare },
    { title: "Total Meals", value: attendanceStats.present, icon: ChefHat }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Mess Dashboard</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-3 mb-6">
            {stats.map((stat) => (
              <Card key={stat.title} className='min-h-[100px]'>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="w-4 h-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{loadingAttendance ? "loading...":stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Today's Menu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <ChefHat className="w-5 h-5 text-black" />
                  Today&apos;s Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMenu ? (
                  <div>Loading...</div> // Replace this with your loading skeleton component
                ) : (
                  <div className="space-y-4">
                    {todayMenu.map((item) => (
                      <div key={item.meal} className="flex justify-between items-start border-b pb-3 text-black">
                        <div>
                          <h3 className="font-medium">{item.meal}</h3>
                          <p className="text-sm text-gray-600">{item.items}</p>
                        </div>
                        <span className="text-sm text-gray-500">{item.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <TrendingUp className="w-5 h-5 text-black" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingActivity ? (
                  <div>Loading...</div> // Replace this with your loading skeleton component
                ) : (
                  <div className="space-y-4 text-black">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 border-b pb-3">
                          <div className={`p-2 rounded-full ${activity.type === 'feedback' ? 'bg-blue-100' : activity.type === 'suggestion' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                            {activity.type === 'feedback' ? (
                              <MessageSquare className="w-4 h-4 text-blue-600" />
                            ) : activity.type === 'suggestion' ? (
                              <Edit3 className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <Calendar className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{activity.activity}</h3>
                            <p className="text-sm text-gray-600">{activity.timestamp}</p>
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
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DashboardPage;