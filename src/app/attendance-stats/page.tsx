// src/app/attendance-stats/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { getFormattedWeeklyAttendance , getFormattedTotalWeeklyAttendance, AttendanceData} from '../../../data/getWeeklyAttendance';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AttendanceStatsPage = () => {
  // Pie chart data for overall attendance status (attended vs missed)
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const totalAttendance = await getFormattedTotalWeeklyAttendance();
      setPresent(totalAttendance.totalPresent);
      setAbsent(totalAttendance.totalAbsent);
    };
    fetchData();
  }, []);
  const pieData = {
    labels: ['Attended', 'Missed'],
    datasets: [
      {
        data: [present, absent], // 80% attended, 20% missed
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#EF5350'],
      },
    ],
  };

  // Bar chart data for attendance by day of the week
  const  [data, setData ] = useState<AttendanceData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const weeklyAttendanceData = await getFormattedWeeklyAttendance();
      setData(weeklyAttendanceData);
    };
    fetchData();
  }, []);

  const chartData = {
    labels: data.map(d => d.day),
    datasets: [
      {
        label: 'Present',
        data: data.map(d => d.present),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Absent',
        data: data.map(d => d.absent),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Attendance Stats',
      },
    },
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
                  <Bar data={chartData} options={options} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceStatsPage;
