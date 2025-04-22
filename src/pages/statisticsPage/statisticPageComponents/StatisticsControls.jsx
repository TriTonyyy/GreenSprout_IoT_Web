import React, { useEffect, useCallback } from "react";
import { timeRanges } from "../constants";
import { startOfDay, endOfDay } from "date-fns";

const StatisticsControls = ({
  timeRange,
  onTimeRangeChange,
  startDate,
  endDate,
  onDateChange,
  onRefresh,
  gardens,
  selectedGarden,
  onGardenChange,
  loadingGardens
}) => {
  const handleTimeRangeChange = useCallback(
    (range) => {
      const now = new Date();
      const start = startOfDay(now);
      const end = endOfDay(now);

      onTimeRangeChange(range);
      onDateChange(start, end);
    },
    [onTimeRangeChange, onDateChange]
  );

  useEffect(() => {
    // Set initial date range when component mounts
    handleTimeRangeChange(timeRanges.DAY);
  }, [handleTimeRangeChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
      <div className="flex-1">
        <select
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedGarden || ""}
          onChange={(e) => onGardenChange(e.target.value)}
          disabled={loadingGardens}
        >
          {loadingGardens ? (
            <option value="">Đang tải vườn...</option>
          ) : gardens.length === 0 ? (
            <option value="">Không có vườn nào</option>
          ) : (
            <>
              <option value="">Chọn vườn</option>
              {gardens.map((garden) => (
                <option key={garden.id} value={garden.id_esp}>
                  {garden.name || `Vườn ${garden.id_esp}`}
                </option>
              ))}
            </>
          )}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded-lg bg-green-600 text-white"
          onClick={() => handleTimeRangeChange(timeRanges.DAY)}
        >
          Ngày
        </button>
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={onRefresh}
      >
        Làm mới
      </button>
    </div>
  );
};

export default StatisticsControls;
