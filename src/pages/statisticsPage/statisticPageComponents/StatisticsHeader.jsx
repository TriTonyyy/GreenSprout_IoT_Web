import React from "react";
import i18n from "../../../i18n";

const StatisticsHeader = () => {
  return (
    <div className="my-5 text-center">
        <p className="text-3xl font-bold text-green-400">
          {i18n.t("sensorDataStatistics")}
        </p>
        <p className="my-1 text-xl text-green-600">
          {i18n.t("trackRecentGardenData")}
        </p>
    </div>
  );
};

export default StatisticsHeader;
