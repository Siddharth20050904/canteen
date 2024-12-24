import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChefHat, MessageSquare, Star, TrendingUp} from "lucide-react";
import { Layout } from '@/components/layout/Layout';

const DashboardPage = () => {
  const stats = [
    { title: "Daily Attendance", value: "85%", icon: Calendar },
    { title: "Menu Rating", value: "4.2", icon: Star },
    { title: "Reviews Given", value: "12", icon: MessageSquare },
    { title: "Meals This Month", value: "45", icon: ChefHat }
  ];

  const todayMenu = [
    { meal: "Breakfast", items: "Idli, Sambar, Chutney", time: "7:30 - 9:00" },
    { meal: "Lunch", items: "Rice, Dal, Vegetables", time: "12:30 - 2:00" },
    { meal: "Dinner", items: "Chapati, Curry, Salad", time: "7:30 - 9:00" },
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="w-4 h-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{stat.value}</div>
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
                <div className="space-y-4 text-black">
                  <div className="flex items-center gap-4 border-b pb-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Submitted Lunch Review</h3>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-b pb-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Marked Attendance</h3>
                      <p className="text-sm text-gray-600">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DashboardPage;