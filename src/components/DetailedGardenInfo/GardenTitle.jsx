import React from "react";

export const GardenTitle = ({ gardenName }, { areaGardenName }) => (
  <div>
    <h1>
      {" "}
      Vườn tiêu {gardenName}: {areaGardenName}
    </h1>
  </div>
);
