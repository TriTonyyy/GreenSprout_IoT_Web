import React from 'react';
import { Droplets, Sun, Wind } from "lucide-react";
import { apiResponseHandler } from "../../../components/Alert/alertComponent";

const MAX_VALUES = {
  water: 100, // %
  light: 100, // %
  wind: 50, // °C - typical max temperature for garden monitoring
};

const SensorConfigPanel = ({
  selectedControl,
  sensorThresholds,
  onThresholdChange,
  onSubmit,
  isOwner,
}) => {
  const convertToDisplayValue = (value, controlType) => {
    if (controlType === "wind") {
      return Math.round((value / 100) * MAX_VALUES.wind);
    }
    return value;
  };

  const handleThresholdChange = (controlType, field, value) => {
    if (!isOwner) {
      apiResponseHandler("Chỉ chủ sở hữu mới có thể thay đổi ngưỡng cảm biến", "error");
      return;
    }
    onThresholdChange(controlType, field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isOwner) {
      apiResponseHandler("Chỉ chủ sở hữu mới có thể lưu ngưỡng cảm biến", "error");
      return;
    }
    onSubmit(e);
  };

  const getGradientColors = (controlType) => {
    switch (controlType) {
      case 'water':
        return {
          start: 'rgb(59, 130, 246)', // blue-500
          middle: 'rgb(34, 197, 94)', // green-500
          end: 'rgb(234, 179, 8)'     // yellow-500
        };
      case 'light':
        return {
          start: 'rgb(71, 85, 105)',  // slate-600
          middle: 'rgb(234, 179, 8)', // yellow-500
          end: 'rgb(245, 158, 11)'    // amber-500
        };
      case 'wind':
        return {
          start: 'rgb(74, 222, 128)', // green-400
          middle: 'rgb(234, 179, 8)', // yellow-500
          end: 'rgb(239, 68, 68)'     // red-500
        };
      default:
        return {
          start: 'rgb(34, 197, 94)',
          middle: 'rgb(234, 179, 8)',
          end: 'rgb(239, 68, 68)'
        };
    }
  };

  const colors = getGradientColors(selectedControl);

  return (
    <div className="mt-6 p-6 border rounded-xl bg-gray-50 shadow-sm">
      {/* Contextual sensor label based on selected control */}
      {selectedControl === "wind" && (
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-8 text-gray-800">
          <Wind size={24} color="#3b82f6" />
          Điều khiển quạt dựa trên nhiệt độ (°C)
        </h2>
      )}

      {selectedControl === "water" && (
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-8 text-gray-800">
          <Droplets size={24} color="#3b82f6" />
          Điều khiển nước dựa trên độ ẩm đất (%)
        </h2>
      )}

      {selectedControl === "light" && (
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-8 text-gray-800">
          <Sun size={24} color="#eab308" />
          Điều khiển đèn dựa trên cường độ ánh sáng (%)
        </h2>
      )}

      {/* Threshold range slider */}
      <div className="space-y-6">
        <div className="relative pt-6 pb-8">
          {/* Background track with direct interaction */}
          <div
            className={`h-4 bg-gray-200 rounded-lg relative ${isOwner ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={(e) => {
              if (!isOwner) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = Math.round((x / rect.width) * 100);

              // Determine if click is closer to min or max handle
              const currentMin = sensorThresholds[selectedControl]?.min || 0;
              const currentMax = sensorThresholds[selectedControl]?.max || 100;
              const distToMin = Math.abs(percentage - currentMin);
              const distToMax = Math.abs(percentage - currentMax);

              if (distToMin < distToMax) {
                handleThresholdChange(selectedControl, "min", percentage);
              } else {
                handleThresholdChange(selectedControl, "max", percentage);
              }
            }}
          >
            {/* Active range with gradient */}
            <div
              className="absolute h-4 rounded-lg"
              style={{
                left: `${sensorThresholds[selectedControl]?.min || 0}%`,
                right: `${100 - (sensorThresholds[selectedControl]?.max || 100)}%`,
                background: `linear-gradient(90deg, 
                  ${colors.start} 0%,
                  ${colors.middle} 50%,
                  ${colors.end} 100%)`
              }}
            />

            {/* Scale markers */}
            <div className="absolute w-full flex justify-between px-2 -top-6">
              {[0, 25, 50, 75, 100].map((value) => {
                const currentMin = Math.round(
                  Number(sensorThresholds[selectedControl]?.min) || 0
                );
                const currentMax = Math.round(
                  Number(sensorThresholds[selectedControl]?.max) || 100
                );
                const shouldHideLabel =
                  value === currentMin || value === currentMax;
                const unit = selectedControl === "wind" ? "°C" : "%";
                const displayValue =
                  selectedControl === "wind"
                    ? Math.round((value * MAX_VALUES.wind) / 100)
                    : value;

                return (
                  <div key={value} className="flex flex-col items-center">
                    <div
                      className={`transition-opacity duration-200 ${
                        shouldHideLabel ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <span className="text-xs text-gray-600">
                        {displayValue}
                        {unit}
                      </span>
                    </div>
                    <div className="h-2 w-0.5 bg-gray-400 mt-1" />
                  </div>
                );
              })}
            </div>

            {/* Min marker */}
            <div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
              style={{
                left: `${sensorThresholds[selectedControl]?.min || 0}%`,
              }}
              onMouseDown={(startEvent) => {
                if (!isOwner) return;
                startEvent.preventDefault();
                const slider = startEvent.currentTarget.parentElement;
                if (!slider) return;

                const handleDrag = (moveEvent) => {
                  const rect = slider.getBoundingClientRect();
                  const x = Math.max(
                    0,
                    Math.min(moveEvent.clientX - rect.left, rect.width)
                  );
                  const percentage = Math.min(
                    Math.round((x / rect.width) * 100),
                    (sensorThresholds[selectedControl]?.max || 100) - 1
                  );
                  handleThresholdChange(selectedControl, "min", percentage);
                };

                const handleMouseUp = () => {
                  window.removeEventListener("mousemove", handleDrag);
                  window.removeEventListener("mouseup", handleMouseUp);
                };

                window.addEventListener("mousemove", handleDrag);
                window.addEventListener("mouseup", handleMouseUp);
              }}
            >
              <div className={`w-6 h-6 bg-white border-2 rounded-full shadow-md ${isOwner ? 'cursor-move' : 'cursor-default'}`} 
                   style={{ borderColor: colors.start }} />
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-sm font-medium" style={{ color: colors.start }}>
                  Tối thiểu:{" "}
                  {selectedControl === "wind"
                    ? convertToDisplayValue(
                        sensorThresholds[selectedControl]?.min || 0,
                        "wind"
                      )
                    : sensorThresholds[selectedControl]?.min || 0}
                  {selectedControl === "wind" ? "°C" : "%"}
                </span>
              </div>
            </div>

            {/* Max marker */}
            <div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
              style={{
                left: `${sensorThresholds[selectedControl]?.max || 100}%`,
              }}
              onMouseDown={(startEvent) => {
                if (!isOwner) return;
                startEvent.preventDefault();
                const slider = startEvent.currentTarget.parentElement;
                if (!slider) return;

                const handleDrag = (moveEvent) => {
                  const rect = slider.getBoundingClientRect();
                  const x = Math.max(
                    0,
                    Math.min(moveEvent.clientX - rect.left, rect.width)
                  );
                  const percentage = Math.max(
                    Math.round((x / rect.width) * 100),
                    (sensorThresholds[selectedControl]?.min || 0) + 1
                  );
                  handleThresholdChange(selectedControl, "max", percentage);
                };

                const handleMouseUp = () => {
                  window.removeEventListener("mousemove", handleDrag);
                  window.removeEventListener("mouseup", handleMouseUp);
                };

                window.addEventListener("mousemove", handleDrag);
                window.addEventListener("mouseup", handleMouseUp);
              }}
            >
              <div className={`w-6 h-6 bg-white border-2 rounded-full shadow-md ${isOwner ? 'cursor-move' : 'cursor-default'}`}
                   style={{ borderColor: colors.end }} />
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-sm font-medium" style={{ color: colors.end }}>
                  Tối đa:{" "}
                  {selectedControl === "wind"
                    ? convertToDisplayValue(
                        sensorThresholds[selectedControl]?.max || 100,
                        "wind"
                      )
                    : sensorThresholds[selectedControl]?.max || 100}
                  {selectedControl === "wind" ? "°C" : "%"}
                </span>
              </div>
            </div>
          </div>

          {/* Description text */}
          <div className="mt-8 text-base text-gray-600 text-center">
            {selectedControl === "wind" ? (
              <p>
                Thiết bị sẽ giúp khu vườn giữ{" "}
                <span className="font-semibold text-lg text-green-600">nhiệt độ</span>{" "}
                trong khoảng{" "}
                <span className="font-semibold text-lg text-green-600">
                  {convertToDisplayValue(
                    sensorThresholds[selectedControl]?.min || 0,
                    "wind"
                  )}
                  °C -{" "}
                  {convertToDisplayValue(
                    sensorThresholds[selectedControl]?.max || 100,
                    "wind"
                  )}
                  °C
                </span>
              </p>
            ) : (
              <p>
                Thiết bị sẽ giúp khu vườn giữ{" "}
                <span className="font-semibold text-lg text-green-600">
                  {selectedControl === "water"
                    ? "độ ẩm đất"
                    : "cường độ ánh sáng"}
                </span>{" "}
                trong khoảng{" "}
                <span className="font-semibold text-lg text-green-600">
                  {sensorThresholds[selectedControl]?.min || 0}% -{" "}
                  {sensorThresholds[selectedControl]?.max || 100}%
                </span>
              </p>
            )}
          </div>
        </div>

        {isOwner && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-500 px-6 py-2.5 text-white rounded-lg hover:bg-green-600 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            >
              Lưu ngưỡng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorConfigPanel; 