import React, { useState } from "react";

const StatisticsControls = ({
  onRefresh,
  gardens,
  selectedGarden,
  onGardenChange,
  loadingGardens,
  onDateChange, // optional
  onModeChange, // optional
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("day");
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const currentGarden = gardens.find(
    (garden) => garden.id_esp === selectedGarden
  );

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (onDateChange) onDateChange(e.target.value);
  };

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);

    // Reset date value on mode change
    const today = new Date();
    if (newMode === "day") {
      setSelectedDate(today.toISOString().split("T")[0]);
    } else if (newMode === "week") {
      const weekStr = `${today.getFullYear()}-W${String(
        getWeekNumber(today)
      ).padStart(2, "0")}`;
      setSelectedDate(weekStr);
    } else {
      const monthStr = today.toISOString().slice(0, 7);
      setSelectedDate(monthStr);
    }
  };

  const getWeekNumber = (date) => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        {/* Garden Selector */}
        <div className="flex-1 relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={loadingGardens}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-between"
          >
            {loadingGardens ? (
              <span>Đang tải vườn...</span>
            ) : currentGarden ? (
              <div className="flex items-center gap-3">
                <img
                  src={
                    currentGarden.img_area ||
                    require("../../../assets/images/ItemImg.png")
                  }
                  alt={currentGarden.name_area}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <span>
                  {currentGarden.name_area ||
                    `Vườn không tên (${currentGarden.id_esp})`}
                </span>
              </div>
            ) : (
              <span>Chọn vườn</span>
            )}
            <svg
              className={`w-5 h-5 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="w-2/5 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {gardens.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">Không có vườn nào</div>
              ) : (
                gardens.map((garden) => (
                  <button
                    key={garden.id}
                    className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 ${
                      garden.id_esp === selectedGarden ? "bg-green-50" : ""
                    }`}
                    onClick={() => {
                      onGardenChange(garden.id_esp);
                      setIsOpen(false);
                    }}
                  >
                    <img
                      src={
                        garden.img_area ||
                        require("../../../assets/images/ItemImg.png")
                      }
                      alt={garden.name_area}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <span>
                      {garden.name_area || `Vườn không tên (${garden.id_esp})`}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 w-1/5">
          {["day", "week", "month"].map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange({ target: { value: m } })}
              className={`px-4 py-2 rounded-lg border ${
                mode === m
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              } hover:bg-green-100 transition-colors`}
            >
              {m === "day" ? "Ngày" : m === "week" ? "Tuần" : "Tháng"}
            </button>
          ))}
        </div>

        {/* Date/Week/Month Picker */}
        <div className="w-1/5">
          <input
            type={mode === "day" ? "date" : mode === "week" ? "week" : "month"}
            value={selectedDate}
            onChange={handleDateChange}
            className="px-4 py-2 w-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Refresh Button */}
        {/* <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={onRefresh}
        >
          Làm mới
        </button> */}
      </div>
    </div>
  );
};

export default StatisticsControls;
