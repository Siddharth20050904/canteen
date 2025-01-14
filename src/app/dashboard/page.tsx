"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardContentSkeleton } from "@/components/ui/card";
import { Calendar, ChefHat, MessageSquare, TrendingUp, Edit3 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { currentDayMenuData } from '../../../data/menuData';
import { getAttendanceStatsByUserId } from '../../../data/userAttendaneStats';
import { getTotalReviewsByUserId } from '../../../server_actions/fetchRevByUserId';
import { recentActivityByUserId } from '../../../server_actions/logActivity';
import { deletionJobScheduler } from '../../../server_actions/cron-job';
import Image from 'next/image';

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              {/* Stats Grid */}
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

              {/* Menu and Activity Cards */}
              <div className="grid grid-cols-1 gap-6">
                {/* Today's Menu */}
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

                {/* Recent Activity */}
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
                                {activity.type === 'feedback' ? (
                                  <MessageSquare className="w-5 h-5 text-green-600" />
                                ) : activity.type === 'suggestion' ? (
                                  <Edit3 className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Calendar className="w-5 h-5 text-green-600" />
                                )}
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DashboardPage;

