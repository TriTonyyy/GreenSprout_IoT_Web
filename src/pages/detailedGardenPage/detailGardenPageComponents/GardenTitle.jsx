import React from "react";

export const GardenTitle = ({
  gardenName = "Unnamed Garden",
  areaGardenName = "Unknown Area",
}) => (
  <div className="w-4/5 mx-auto my-2 text-center p-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-xl shadow-2xl">
    <h1 className="text-4xl font-bold text-white hover:text-green-100 transition-colors duration-300 ease-in-out transform hover:scale-105">
      {gardenName}
    </h1>
    <h2 className="text-2xl text-gray-200 mt-3 tracking-wide">
      {areaGardenName}
    </h2>
  </div>
);
