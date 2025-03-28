import React from "react";

export const GardenTitle = ({
  gardenName = "Unnamed Garden",
  areaGardenName = "Unknown Area",
}) => (
  <div className="text-left px-6 py-4">
    <h1 className="text-3xl font-semibold text-gray-800">{gardenName}</h1>
    <h2 className="text-xl text-gray-500">{areaGardenName}</h2>
  </div>
);
