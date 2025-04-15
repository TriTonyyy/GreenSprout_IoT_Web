import React, { useState, useEffect } from "react";
import {
  Pencil,
  Droplets,
  Thermometer,
  CloudRain,
  ShowerHead,
  Sun,
  User,
  Fan,
  Lightbulb,
  Droplet,
} from "lucide-react";
import { ToggleSwitch } from "../../../components/ToggleComponent/ToggleSwitch";
import {
  getGardenByDevice,
  getMemberByIdDevice,
  updateControlById,
} from "../../../api/deviceApi";
import { apiResponseHandler } from "../../../components/Alert/alertComponent";
import { useQuery } from '@tanstack/react-query';
import { MemberList } from "./MemberList";
import { GardenStatus } from "./GardenStatus";

const GardenImage = ({ src }) => (
  <div className="flex justify-center items-center p-4">
    <img
      src={src}
      alt="Garden"
      className="rounded-xl shadow-md max-h-64 object-cover border border-gray-300"
    />
  </div>
);

const SensorReading = ({ label, value, unit, icon }) => (
  <div className="mx-2 my-3 flex justify-between items-center">
    <div className="flex items-center space-x-2 min-w-[140px]">
      <span className="text-xl">{icon}</span>
      <p className="font-semibold text-gray-600 truncate">{label}:</p>
    </div>
    <div className="flex items-center space-x-1">
      <p className="text-gray-800 font-medium min-w-[50px] text-right">
        {value ?? "---"}
      </p>
      <p className="text-gray-500 text-sm">
        {unit}
      </p>
    </div>
  </div>
);

const ModeSelector = ({ currentMode, onChange }) => {
  const modes = ["Thủ công", "Theo lịch", "Ngưỡng"];
  const modeMap = {
    "Thủ công": "manual",
    "Theo lịch": "schedule",
    Ngưỡng: "threshold",
  };

  return (
    <div className="flex space-x-1 text-xs">
      {modes.map((mode) => (
        <button
          key={mode}
          className={`px-3 py-1 rounded-md transition-colors duration-200 font-medium
            ${
              currentMode === modeMap[mode] // Check against the API value
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          onClick={() => onChange(modeMap[mode])} // Send API value on click
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}{" "}
          {/* Capitalize first letter */}
        </button>
      ))}
    </div>
  );
};

export const DetailedGardenInfo = ({ deviceId }) => {
  // Query for garden data with optimized polling
  const { data: gardenData, error } = useQuery({
    queryKey: ['garden-info', deviceId],
    queryFn: async () => {
      const response = await getGardenByDevice(deviceId);
      return response.data;
    },
    refetchInterval: 1000, // Poll every second
    staleTime: 500, // Consider data fresh for 500ms
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading garden information: {error.message}
      </div>
    );
  }

  if (!gardenData) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/2">
        <GardenStatus gardenData={gardenData} />
      </div>
      <div className="w-full md:w-1/2">
        <MemberList members={gardenData.members || []} />
      </div>
    </div>
  );
};

export const DetailedGardenInfoSkeleton = () => {
  return (
    <div className="mx-5 bg-white rounded-xl shadow-md py-2 grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-10 items-stretch animate-pulse">
      {/* Image Section Skeleton */}
      <div className="col-span-1 flex flex-col md:border-r">
        <div className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Hình ảnh
        </div>
        <div className="h-48 bg-gray-200 rounded-lg m-4"></div>
      </div>

      {/* Sensor Section Skeleton */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-4">
        <div className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Cảm biến
        </div>
        <div className="flex flex-col px-4 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>

      {/* Control Section Skeleton */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-4">
        <div className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Điều khiển
        </div>
        <div className="flex flex-col items-center mt-2 w-full px-4 space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-full">
              <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2 w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              {i < 1 && (
                <div className="w-full border-b border-gray-300 my-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Member Section Skeleton */}
      <div className="col-span-1 h-full min-h-[200px] flex flex-col space-y-4">
        <div className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Thành viên
        </div>
        <div className="flex flex-col px-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
