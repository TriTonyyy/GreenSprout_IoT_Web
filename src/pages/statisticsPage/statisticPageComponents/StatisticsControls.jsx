import React, { useState } from "react";

const StatisticsControls = ({
  onRefresh,
  gardens,
  selectedGarden,
  onGardenChange,
  loadingGardens,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentGarden = gardens.find(garden => garden.id_esp === selectedGarden);

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="flex-1 relative">
          {/* Custom Dropdown Button */}
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
                  src={currentGarden.img_area || require("../../../assets/images/ItemImg.png")}
                  alt={currentGarden.name_area}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <span>{currentGarden.name_area || `Vườn không tên (${currentGarden.id_esp})`}</span>
              </div>
            ) : (
              <span>Chọn vườn</span>
            )}
            <svg
              className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {gardens.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">Không có vườn nào</div>
              ) : (
                gardens.map((garden) => (
                  <button
                    key={garden.id}
                    className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 ${
                      garden.id_esp === selectedGarden ? 'bg-green-50' : ''
                    }`}
                    onClick={() => {
                      onGardenChange(garden.id_esp);
                      setIsOpen(false);
                    }}
                  >
                    <img
                      src={garden.img_area || require("../../../assets/images/ItemImg.png")}
                      alt={garden.name_area}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <span>{garden.name_area || `Vườn không tên (${garden.id_esp})`}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={onRefresh}
        >
          Làm mới
        </button>
      </div>
    </div>
  );
};

export default StatisticsControls;
