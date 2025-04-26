import React from "react";
import SensorChart from "../../../components/Charts/SensorChart";

const StatisticsChart = ({ sensorData, reportData, time, mode }) => {
  if (!sensorData || !reportData) return null;

  const chartDataObj =
    typeof sensorData === "function" ? sensorData(reportData) : sensorData;

  // Function to format the time string
  const formatTime = (time, mode) => {
    console.log(time);
    switch (mode) {
      case "day": {
        const date = new Date(time);
        if (isNaN(date.getTime())) return time;
        return `trong ngày ${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
      }
      case "month": {
        const date = new Date(time);
        if (isNaN(date.getTime())) return time;
        return `trong năm ${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}/${date.getFullYear()}`;
      }
      case "week": {
        const weekString = formatWeekRange(time);
        return `từ ngày ${weekString}`;
      }
      default:
        return time; // fallback
    }
  };

  function formatWeekRange(weekString) {
    const dates = getWeekDates(weekString); // ["21/04", ..., "27/04"]
    const [year] = weekString.split("-W");
    const startDay = dates[0].split("/")[0]; // "21"
    const endDayMonth = dates[dates.length - 1]; // "27/04"
    return `${startDay} - ${endDayMonth}/${year}`;
  }

  function getWeekDates(weekString) {
    const [year, week] = weekString.split("-W").map(Number);
    // Start from the first Thursday of the year
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    // ISO weeks start on Monday
    const dayOfWeek = simple.getDay();
    const ISOweekStart = simple;
    if (dayOfWeek <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }
    // Now get all 7 days
    const days = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(ISOweekStart);
      current.setDate(ISOweekStart.getDate() + i);
      days.push(
        `${String(current.getDate()).padStart(2, "0")}/${String(
          current.getMonth() + 1
        ).padStart(2, "0")}`
      );
    }
    return days;
  }

  return (
    <div className="bg-white rounded-xl shadow-md py-4 my-6 transition-all duration-300 hover:scale-105 hover:shadow-lg will-change-transform">
      <SensorChart
        data={chartDataObj}
        title={`Dữ liệu các cảm biến ${formatTime(time, mode)}`}
      />
    </div>
  );
};

export default StatisticsChart;
