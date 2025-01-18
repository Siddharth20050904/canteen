"use client";

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title 
} from 'chart.js';
import { 
  getFormattedWeeklyAttendance, 
  getFormattedTotalWeeklyAttendance, 
  AttendanceData 
} from '../../../data/getWeeklyAttendance';
import Image from 'next/image';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title
);

/**
 * AttendanceStatsPage Component
 * 
 * Displays attendance statistics using charts and visualizations.
 * Features:
 * - Overall attendance pie chart
 * - Weekly attendance bar chart
 * - Responsive layout with hero image
 */
const AttendanceStatsPage = () => {
  // ===== State Management =====
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [data, setData] = useState<AttendanceData[]>([]);

  // ===== Data Fetching =====
  useEffect(() => {
    const fetchData = async () => {
      // Fetch total attendance statistics
      const totalAttendance = await getFormattedTotalWeeklyAttendance();
      setPresent(totalAttendance.totalPresent);
      setAbsent(totalAttendance.totalAbsent);

      // Fetch weekly attendance data
      const weeklyAttendanceData = await getFormattedWeeklyAttendance();
      setData(weeklyAttendanceData);
    };
    fetchData();
  }, []);

  // ===== Chart Configurations =====
  /**
   * Configuration for the pie chart showing overall attendance
   */
  const pieData = {
    labels: ['Attended', 'Missed'],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#EF5350'],
      },
    ],
  };

  /**
   * Configuration for the bar chart showing weekly attendance
   */
  const chartData = {
    labels: data.map(d => d.day),
    datasets: [
      {
        label: 'Present',
        data: data.map(d => d.present),
        backgroundColor: 'rgba(147,227,171,0.6)',
      },
      {
        label: 'Absent',
        data: data.map(d => d.absent),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  /**
   * Options for the bar chart configuration
   * Including responsiveness, legends, and axis settings
   */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Attendance Stats',
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 90,
          minRotation: 90,
          autoSkip: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Attendance Count'
        }
      }
    },
  };

  // ===== Render Components =====
  /**
   * Renders the hero image section
   */
  const renderHeroImage = () => (
    <div className="lg:w-1/2 flex items-start justify-start">
      <div className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] mx-auto">
        <div className="pb-[100%]">
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <Image 
              src="/vectors/stats.png"
              alt="Attendance Stats Vector"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders the charts section
   */
  const renderCharts = () => (
    <div className="lg:w-1/2 h-[calc(100vh-12rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="space-y-8 pb-8">
        {/* Pie Chart Card */}
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Overall Attendance Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="w-[300px] h-[300px]">
                <Pie data={pieData} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart Card */}
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Attendance by Day</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="w-full h-[400px]">
                <Bar data={chartData} options={options} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ===== Main Render =====
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        {/* Page Header */}
        <div className='grid grid-cols-1 lg:grid-cols-2 text-center'>
          <div/>
          <h1 className="text-2xl font-bold">Attendance Tracking</h1>
          <div/>
          <p className="text-gray-600">Track attendance data and trends for students</p>
        </div>

        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {renderHeroImage()}
            {renderCharts()}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default AttendanceStatsPage;