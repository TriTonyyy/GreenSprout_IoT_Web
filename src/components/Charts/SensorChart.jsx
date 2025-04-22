import React, { useEffect } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SensorChart = React.memo(({ data, title }) => {
  if (!data?.datasets?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No data available to display
      </div>
    );
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: title || "Dữ liệu cảm biến",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: { top: 20, bottom: 20 },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const label = context.dataset.label;
            const unit = label.match(/\((.*?)\)/)?.[1] || "";
            return value === null
              ? `${label}: No data`
              : `${label}: ${value?.toFixed(1)}${unit ? ` ${unit}` : ""}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: function (value) {
            return value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      line: { tension: 0.4 },
      point: {
        radius: (context) => (context.raw === null ? 0 : 3),
        hoverRadius: (context) => (context.raw === null ? 0 : 5),
      },
    },
    maintainAspectRatio: false,
  };
  return (
    <div className="p-6">
      <div style={{ height: "500px" }}>
        <Line id="sensor-chart" options={options} data={data} />
      </div>
    </div>
  );
});

SensorChart.displayName = "SensorChart";

export default SensorChart;
