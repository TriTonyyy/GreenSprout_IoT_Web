import React from "react";
import { sensorTypes } from "./constants";

const StatisticsSummary = ({ stats, selectedSensor }) => {
  if (!stats) return null;

  const summaryItems = [
    { label: "Thấp nhất", value: stats.min },
    { label: "Cao nhất", value: stats.max },
    { label: "Trung bình", value: stats.avg },
    { label: "Hiện tại", value: stats.current },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryItems.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-6 transition-transform hover:transform hover:scale-105"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            {stat.label}
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stat.value}
            <span className="text-lg ml-1 text-gray-600">
              {sensorTypes[selectedSensor].unit}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatisticsSummary;
