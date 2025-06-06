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
import i18n from "../../i18n";

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
  // console.log("SensorChart data", data);
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
            // console.log("label", label);
            
            const unit = label.match(/\((.*?)\)/)?.[1] || "";
            return value === null
              ? `${i18n.t(label)}: No data`
              : `${i18n.t(label)}: ${value?.toFixed(1)}${unit ? ` ${unit}` : ""}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
          color: "#6B7280",
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          display: true,
          color: "rgba(107, 114, 128, 0.1)",
          drawBorder: false,
          lineWidth: 1,
          drawTicks: true,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          padding: 10,
          stepSize: 20,
          display: true,
          font: {
            size: 11,
          },
          callback: function (value) {
            return value.toFixed(0);
          },
        },
        min: 0,
        suggestedMax: 100,
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
    <div className="px-6">
      <div style={{ height: "500px" }}>
        <Line id="sensor-chart" options={options} data={data} />
      </div>
    </div>
  );
});

SensorChart.displayName = "SensorChart";

export default SensorChart;
