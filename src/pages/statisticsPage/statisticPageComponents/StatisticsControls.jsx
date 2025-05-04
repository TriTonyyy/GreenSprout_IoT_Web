import React, { useState } from "react";
import { RefreshCcw } from "lucide-react";
import i18n from "../../../i18n";

const StatisticsControls = ({
  onRefresh,
  gardens,
  selectedGarden,
  onGardenChange,
  loadingGardens,
  mode,
  selectedDate,
  onDateChange, // optional
  onModeChange, // optional
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentGarden = gardens.find(
    (garden) => garden.id_esp === selectedGarden
  );

  const handleModeChange = (newMode) => {
    if (onModeChange) onModeChange(newMode); // Call parent callback to update mode

    const today = new Date();
    let formattedDate = "";

    if (newMode === "day") {
      formattedDate = today.toISOString().split("T")[0];
    } else if (newMode === "week") {
      formattedDate = `${today.getFullYear()}-W${String(
        getWeekNumber(today)
      ).padStart(2, "0")}`;
    } else {
      formattedDate = today.toISOString().slice(0, 7);
    }

    // Update the date using the parent callback
    if (onDateChange) onDateChange(formattedDate);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (onDateChange) onDateChange(newDate); // Triggers parent callback
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
    <div className="my-5">
      <div className="my-3 flex flex-col md:flex-row items-center justify-between w-full">
        {/* Garden Selector */}
        <div className="relative w-full md:w-1/3 lg:w-1/4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={loadingGardens}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-between"
          >
            {loadingGardens ? (
              <span>{i18n.t("loadingGarden")}</span>
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
              <span>{i18n.t("selectGarden")}</span>
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
            <div className="absolute z-10 w-full top-full left-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {gardens.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">{i18n.t("noGardens")}</div>
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

        {/* Right-side controls */}
        <div className="md:mt-0 flex gap-4 items-center w-full md:w-auto justify-end">
          {/* Mode Selector */}
          <div className="flex gap-2">
            {["day", "week", "month"].map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`px-4 py-2 rounded-lg border ${
                  mode === m
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-700 border-gray-300"
                } hover:bg-green-100 transition-colors`}
              >
                {m === "day" ? i18n.t("day") : m === "week" ? i18n.t("week") : i18n.t("year")}
              </button>
            ))}
          </div>

          {/* Date/Week/Month Picker */}
          <div>
            <input
              type={
                mode === "day" ? "date" : mode === "week" ? "week" : "month"
              }
              value={selectedDate} // bind selectedDate
              onChange={handleDateChange}
              className="px-4 py-2 w-[170px] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Refresh Button */}
          <div>
            <button
              className="bg-green-600 text-white rounded-2xl p-2"
              onClick={onRefresh}
            >
              <RefreshCcw size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsControls;
