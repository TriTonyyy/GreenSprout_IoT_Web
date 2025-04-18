import React from "react";
import { sensorTypes } from "./constants";
import SensorChart from "../../components/Charts/SensorChart";

const StatisticsChart = ({ sensorData, selectedSensor }) => {
  if (!sensorData) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm ">
      <SensorChart
        data={sensorData}
        title={`${sensorTypes[selectedSensor].label} theo thời gian`}
        yAxisLabel={`${sensorTypes[selectedSensor].label} (${sensorTypes[selectedSensor].unit})`}
      />
    </div>
  );
};

export default StatisticsChart;
