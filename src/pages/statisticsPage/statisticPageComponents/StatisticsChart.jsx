import React from "react";
import SensorChart from "../../../components/Charts/SensorChart";

const StatisticsChart = ({ sensorData, reportData }) => {
  if (!sensorData || !reportData) return null;

  const chartDataObj = typeof sensorData === 'function' ? sensorData(reportData) : sensorData;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <SensorChart
        data={chartDataObj}
        title="Dữ liệu cảm các biến theo thời gian"
      />
    </div>
  );
};

export default StatisticsChart;
