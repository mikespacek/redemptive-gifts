"use client";

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { GiftType, giftDescriptions } from '../lib/gift-descriptions';

// Register Chart.js components
Chart.register(...registerables);

interface ResultsChartProps {
  scores: Record<GiftType, number>;
}

const ResultsChart = ({ scores }: ResultsChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Get gift names and their corresponding scores
    const labels = Object.keys(scores).map(
      (gift) => giftDescriptions[gift as GiftType].name
    );
    const data = Object.values(scores);
    
    // Get colors for each gift
    const backgroundColors = Object.keys(scores).map(
      (gift) => {
        switch(gift) {
          case 'prophet': return 'rgba(239, 68, 68, 0.7)';  // red
          case 'servant': return 'rgba(59, 130, 246, 0.7)'; // blue
          case 'teacher': return 'rgba(34, 197, 94, 0.7)';  // green
          case 'exhorter': return 'rgba(234, 179, 8, 0.7)'; // yellow
          case 'giver': return 'rgba(168, 85, 247, 0.7)';   // purple
          case 'ruler': return 'rgba(249, 115, 22, 0.7)';   // orange
          case 'mercy': return 'rgba(236, 72, 153, 0.7)';   // pink
          default: return 'rgba(107, 114, 128, 0.7)';       // gray
        }
      }
    );

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Gift Scores',
            data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Score: ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [scores]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Your Gift Profile</h3>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ResultsChart; 