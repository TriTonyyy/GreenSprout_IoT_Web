import React from "react";
import { sensorLabels, colors } from "../constants";

const StatisticsSummary = ({ reportData }) => {
  if (!reportData) return null;
  // console.log(reportData);

  const calculateMinMax = (array) => {
    if (!Array.isArray(array) || array.length === 0) return [null, null];
    const validValues = array.filter((val) => val !== null && !isNaN(val));
    if (validValues.length === 0) return [null, null];

    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    return [min, max];
  };

  const stats = [
    {
      label: sensorLabels.tempurature_avg,
      value: calculateMinMax(reportData.tempurature_avg),
      type: "tempurature_avg",
    },
    {
      label: sensorLabels.humidity_avg,
      value: calculateMinMax(reportData.humidity_avg),
      type: "humidity_avg",
    },

    {
      label: sensorLabels.soil_moisture_avg,
      value: calculateMinMax(reportData.moisture_avg),
      type: "soil_moisture_avg",
    },
    {
      label: sensorLabels.luminosity_avg,
      value: calculateMinMax(reportData.luminosity_avg),
      type: "luminosity_avg",
    },
  ];
  const statOfWaterUsage = [
    {
      label: sensorLabels.water_usage,
      value: reportData.water_usage || 0,
      type: "water_usage",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-1 gap-6">
      {/* Left Column: Sensor Stats */}
      <div className="lg:col-span-2 bg-white py-2 flex flex-col h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          {stats
            .filter((item) => item.label !== sensorLabels.water_usage)
            .map((item) => (
              <StatisticsItem
                key={item.label}
                label={item.label}
                value={item.value}
                type={item.type}
              />
            ))}
        </div>
      </div>

      {/* Right Column: Water Usage */}
      <div className="bg-white py-2 h-full flex flex-col">
        {statOfWaterUsage.map((item) => (
          <StatisticsItem
            key={item.label}
            label={item.label}
            value={item.value}
            type={item.type}
          />
        ))}
      </div>
    </div>
  );
};

const StatisticsItem = ({ label, value, type }) => {
  const unit = label.match(/\((.*?)\)/)?.[1] || "";
  const isRange = Array.isArray(value);
  const isWaterUsage = label === "Lượng nước đã dùng (L)";
  const displayLabel = isWaterUsage ? "Tổng lượng nước đã dùng" : label;

  return (
    <div
      className={`relative py-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white border-l-4 h-full ${
        isWaterUsage ? "border-blue-500" : "border-gray-300"
      }`}
      style={{
        backgroundColor: !isWaterUsage
          ? colors[type]?.cardBg || "#f9fafb"
          : "#ebf4ff",
      }}
    >
      <div className="flex flex-col justify-center text-center h-full gap-3">
        <h3
          className={`text-base font-semibold tracking-wide w-full text-center ${
            isWaterUsage ? "text-blue-600" : "text-grey-200"
          }`}
        >
          {displayLabel}
        </h3>

        {value !== null ? (
          isRange ? (
            <div className="flex justify-around gap-10 text-gray-900 text-lg font-semibold">
              <div>
                <span className="text-sm font-medium text-blue-500">Thấp nhất:</span>{" "}
                {value[0]?.toFixed(2)} {unit}
              </div>
              <div>
                <span className="text-sm font-medium text-rose-500">Cao nhất:</span>{" "}
                {value[1]?.toFixed(2)} {unit}
              </div>
            </div>
          ) : (
            <div className="text-3xl font-bold text-gray-900">
              {value.toFixed(2)} {unit}
            </div>
          )
        ) : (
          <div className="text-xl font-medium text-gray-500">N/A</div>
        )}
      </div>
    </div>
  );
};

export default StatisticsSummary;
