import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register the required chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register the Filler plugin for area charts
);

const SensorChart = ({ data, title, yAxisLabel }) => {
  console.log("SensorChart rendering with data:", data); // Debug log

  if (!data || !data.datasets || !data.labels) {
    console.error("Invalid chart data format:", data); // Debug errors
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center text-red-500">
        Error: Invalid chart data format
      </div>
    );
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisLabel,
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4, // Makes the line smoother
      },
      point: {
        radius: 2, // Smaller points for better performance with large datasets
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default SensorChart;
