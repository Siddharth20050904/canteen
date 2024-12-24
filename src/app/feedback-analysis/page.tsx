// src/app/feedback-analysis/page.tsx
"use client";
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FeedbackAnalysisPage = () => {
  const pieData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ['#4CAF50', '#FFEB3B', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#FFF176', '#EF5350'],
      },
    ],
  };

  const barData = {
    labels: ['Quality', 'Service', 'Cleanliness', 'Ambiance'],
    datasets: [
      {
        label: 'Positive',
        data: [85, 80, 70, 75],
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Neutral',
        data: [10, 15, 20, 15],
        backgroundColor: '#FFEB3B',
      },
      {
        label: 'Negative',
        data: [5, 5, 10, 10],
        backgroundColor: '#F44336',
      },
    ],
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Feedback Analysis</h1>
          <p className="text-gray-600">Analyze feedback received from customers</p>
        </div>

        {/* Charts Container */}
        <div className="flex flex-wrap gap-4">
          {/* Pie Chart */}
          <Card className="flex-1 min-w-[300px] max-w-[400px]">
            <CardHeader>
              <CardTitle>Overall Feedback Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-[300px] h-[300px]">
                  <Pie data={pieData} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="flex-1 min-w-[300px]">
            <CardHeader>
              <CardTitle>Feedback by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-full max-w-[600px] h-[400px]">  {/* Increased height */}
                  <Bar data={barData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                The majority of our feedback has been positive, with customers particularly appreciating the quality of our food and the service provided by our staff.
                There have been some neutral and negative comments regarding cleanliness and ambiance, which we will address to improve customer satisfaction.
              </p>
              <ul className="list-disc pl-5">
                <li>Positive feedback is predominantly about the quality of the food.</li>
                <li>Neutral feedback often mentions acceptable but improvable service.</li>
                <li>Negative feedback highlights issues with cleanliness and ambiance.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FeedbackAnalysisPage;
