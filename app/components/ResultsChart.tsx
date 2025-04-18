"use client";

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { GiftType, giftDescriptions } from '../lib/gift-descriptions';

// Register Chart.js components
Chart.register(...registerables);

// Add plugin for displaying values on top of bars
const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: any) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

// Plugin to display values on top of bars
const datalabelsPlugin = {
  id: 'datalabels',
  afterDatasetsDraw: (chart: any) => {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta.hidden) {
        meta.data.forEach((element: any, index: number) => {
          // Get the data value
          const value = dataset.data[index];

          // Draw the value on top of the bar
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(value, element.x, element.y - 8);
        });
      }
    });
  }
};

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
    const giftEntries = Object.entries(scores);

    // Sort gifts by name for consistent display order
    const sortedGifts = giftEntries.sort((a, b) => {
      const orderMap: Record<GiftType, number> = {
        'prophet': 1,
        'servant': 2,
        'teacher': 3,
        'exhorter': 4,
        'giver': 5,
        'ruler': 6,
        'mercy': 7
      };
      return orderMap[a[0] as GiftType] - orderMap[b[0] as GiftType];
    });

    const labels = sortedGifts.map(
      ([gift]) => giftDescriptions[gift as GiftType].name
    );

    // Use the actual score values
    const data = sortedGifts.map(([_, score]) => score);

    // Log the data to verify we have different values
    console.log('Chart data:', data);

    // Get colors for each gift
    const backgroundColors = sortedGifts.map(
      ([gift]) => {
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

    // Find the max value for proper scaling
    const maxValue = Math.max(...data);
    const yAxisMax = Math.ceil(maxValue * 1.2); // Add 20% padding for value labels

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      plugins: [plugin, datalabelsPlugin],
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
            // Custom data labels will be handled by our plugin
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          // Register our custom plugins
          customCanvasBackgroundColor: { enabled: true },
          datalabels: { enabled: true },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Score: ${context.parsed.y}`;
              }
            }
          },
          title: {
            display: true,
            text: 'Your Gift Profile Scores',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: yAxisMax, // Dynamic max based on data
            ticks: {
              precision: 0, // Show whole numbers only
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
    <div className="h-96">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ResultsChart;