import React from 'react';

const ScheduleSkeleton = () => {
  return (
    <div className="w-72 h-[220px] bg-gray-50 rounded-xl shadow-md p-5 animate-pulse flex flex-col justify-between border-2 border-transparent">
      {/* Time */}
      <div className="h-8 w-32 bg-gray-200 rounded-lg mb-3" />

      {/* Duration & Repeat */}
      <div className="space-y-3">
        <div className="h-5 w-40 bg-gray-200 rounded-lg" /> {/* Duration */}
        <div className="h-5 w-48 bg-gray-200 rounded-lg" /> {/* Repeat */}
      </div>

      {/* Toggle row */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
        <div className="h-5 w-20 bg-gray-200 rounded-lg" /> {/* Label */}
        <div className="h-7 w-14 bg-gray-200 rounded-full" /> {/* Toggle */}
      </div>
    </div>
  );
};

export default ScheduleSkeleton; 