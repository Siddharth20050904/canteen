// src/app/attendance-stats/page.tsx
"use client";
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AttendanceStatsPage = () => {
  // Pie chart data for overall attendance status (attended vs missed)
  const pieData = {
    labels: ['Attended', 'Missed'],
    datasets: [
      {
        data: [80, 20], // 80% attended, 20% missed
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#EF5350'],
      },
    ],
  };

  // Bar chart data for attendance by day of the week
  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Attendance (No. of Students)',
        data: [150, 130, 170, 160, 140],
        backgroundColor: '#4CAF50', // Green color for attended
        borderColor: '#388E3C',
        borderWidth: 1,
      },
      {
        label: 'Missed (No. of Students)',
        data: [10, 30, 20, 15, 25],
        backgroundColor: '#F44336', // Red color for missed
        borderColor: '#D32F2F',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Attendance Tracking</h1>
          <p className="text-gray-600">Track attendance data and trends for students</p>
        </div>

        {/* Charts Container */}
        <div className="flex flex-wrap gap-4">
          {/* Pie Chart for Overall Attendance */}
          <Card className="flex-1 min-w-[300px] max-w-[400px]">
            <CardHeader>
              <CardTitle>Overall Attendance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-[300px] h-[300px]">
                  <Pie data={pieData} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart for Attendance by Day */}
          <Card className="flex-1 min-w-[300px]">
            <CardHeader>
              <CardTitle>Attendance by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-full max-w-[600px] h-[400px]">
                  <Bar data={barData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                The overall attendance rate is quite high with 80% of students attending classes regularly. 
                The lowest attendance was recorded on Wednesday, possibly due to external factors like exams or events.
              </p>
              <ul className="list-disc pl-5">
                <li>Monday has the highest attendance, with a slight dip in the following days.</li>
                <li>Friday shows a moderate drop in attendance, likely due to weekend fatigue.</li>
                <li>Missed classes on certain days can be attributed to unforeseen absences or scheduling conflicts.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AttendanceStatsPage;
