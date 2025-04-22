import React from "react";
import SensorChart from "../../../components/Charts/SensorChart";

const StatisticsChart = ({ sensorData, reportData }) => {
  if (!sensorData || !reportData) return null;

  const chartDataObj =
    typeof sensorData === "function" ? sensorData(reportData) : sensorData;

  return (
    <div className="bg-white rounded-xl shadow-md py-4 my-6 transition-all duration-300 hover:scale-105 hover:shadow-lg will-change-transform">
      <SensorChart
        data={chartDataObj}
        title="Dữ liệu cảm các biến theo thời gian"
      />
    </div>
  );
};

export default StatisticsChart;
