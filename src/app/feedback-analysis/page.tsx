"use client";
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { PieData } from '../../../data/reviewChartData';
import { getBarPlotData , DayReviewStats } from '../../../data/getBarPlot';
import { useState, useEffect } from 'react';

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

  console.log(barPlotData);


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
    }

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
  };  return (
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
                  <Bar data={barData} options={options} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );


};export default FeedbackAnalysisPage;