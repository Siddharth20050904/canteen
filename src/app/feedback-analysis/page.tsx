"use client";
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { PieData } from '../../../data/reviewChartData';
import { getBarPlotData, DayReviewStats } from '../../../data/getBarPlot';
import { useState, useEffect } from 'react';
import Image from 'next/image';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FeedbackAnalysisPage = () => {
  const [barPlotData, setBarPlotData] = useState<DayReviewStats[]>([]);
  const [pieDataValues, setPieDataValues] = useState({ posRev: 0, neuRev: 0, negRev: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBarPlotData();
        const { posRev, neuRev, negRev } = await PieData();
        setPieDataValues({ posRev, neuRev, negRev });
        setBarPlotData(data);
      } catch (error) {
        console.error('Error fetching bar plot data:', error);
      }
    };

    fetchData();
  }, []);

  const pieData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        backgroundColor: ['#4CAF50', '#FFEB3B', '#F44336'],
        data: [pieDataValues.posRev, pieDataValues.neuRev, pieDataValues.negRev],
      },
    ],
  };

  const options = {
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
          text: 'Review Count'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Reviews by Meal Time'
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20
      }
    }
  };

  const barData = {
    labels: [
      'Sun-Breakfast', 'Sun-Lunch', 'Sun-Snacks', 'Sun-Dinner',
      'Mon-Breakfast', 'Mon-Lunch', 'Mon-Snacks', 'Mon-Dinner',
      'Tue-Breakfast', 'Tue-Lunch', 'Tue-Snacks', 'Tue-Dinner',
      'Wed-Breakfast', 'Wed-Lunch', 'Wed-Snacks', 'Wed-Dinner',
      'Thu-Breakfast', 'Thu-Lunch', 'Thu-Snacks', 'Thu-Dinner',
      'Fri-Breakfast', 'Fri-Lunch', 'Fri-Snacks', 'Fri-Dinner',
      'Sat-Breakfast', 'Sat-Lunch', 'Sat-Snacks', 'Sat-Dinner'
    ],
    datasets: [
      {
        label: 'Positive Reviews',
        data: barPlotData.flatMap(day => [
          day.breakfast.mainCourse.posRev + day.breakfast.sideDish.posRev + day.breakfast.dessert.posRev + day.breakfast.beverage.posRev,
          day.lunch.mainCourse.posRev + day.lunch.sideDish.posRev + day.lunch.dessert.posRev + day.lunch.beverage.posRev,
          day.snack.mainCourse.posRev + day.snack.sideDish.posRev + day.snack.dessert.posRev + day.snack.beverage.posRev,
          day.dinner.mainCourse.posRev + day.dinner.sideDish.posRev + day.dinner.dessert.posRev + day.dinner.beverage.posRev
        ]),
        backgroundColor: '#4CAF50',
        stack: 'stack'
      },
      {
        label: 'Neutral Reviews',
        data: barPlotData.flatMap(day => [
          day.breakfast.mainCourse.neuRev + day.breakfast.sideDish.neuRev + day.breakfast.dessert.neuRev + day.breakfast.beverage.neuRev,
          day.lunch.mainCourse.neuRev + day.lunch.sideDish.neuRev + day.lunch.dessert.neuRev + day.lunch.beverage.neuRev,
          day.snack.mainCourse.neuRev + day.snack.sideDish.neuRev + day.snack.dessert.neuRev + day.snack.beverage.neuRev,
          day.dinner.mainCourse.neuRev + day.dinner.sideDish.neuRev + day.dinner.dessert.neuRev + day.dinner.beverage.neuRev
        ]),
        backgroundColor: '#FFEB3B',
        stack: 'stack'
      },
      {
        label: 'Negative Reviews',
        data: barPlotData.flatMap(day => [
          day.breakfast.mainCourse.negRev + day.breakfast.sideDish.negRev + day.breakfast.dessert.negRev + day.breakfast.beverage.negRev,
          day.lunch.mainCourse.negRev + day.lunch.sideDish.negRev + day.lunch.dessert.negRev + day.lunch.beverage.negRev,
          day.snack.mainCourse.negRev + day.snack.sideDish.negRev + day.snack.dessert.negRev + day.snack.beverage.negRev,
          day.dinner.mainCourse.negRev + day.dinner.sideDish.negRev + day.dinner.dessert.negRev + day.dinner.beverage.negRev
        ]),
        backgroundColor: '#F44336',
        stack: 'stack'
      }
    ]
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        {/* Page Header */}
        <div className='grid grid-cols-1 lg:grid-cols-2 text-center'>
          <div/>
          <h1 className="text-2xl font-bold">Feedback Analysis</h1>
          <div/>
          <p className="text-gray-600">Analyze feedback received from customers</p>
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Hero Image */}
            <div className="lg:w-1/2 flex items-start justify-start">
              <div className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] mx-auto">
                <div className="pb-[100%]">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <Image 
                      src="/vectors/feedback-analysis.png"
                      alt="Feedback Analysis Vector"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Charts with Scroll */}
            <div className="lg:w-1/2 h-[calc(100vh-12rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="space-y-8 pb-8">
                {/* Pie Chart */}
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>Overall Feedback Sentiment</span>
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

                {/* Bar Chart */}
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>Feedback by Category</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <div className="w-full h-[400px]">
                        <Bar data={barData} options={options} />
                      </div>
                    </div>
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

export default FeedbackAnalysisPage;