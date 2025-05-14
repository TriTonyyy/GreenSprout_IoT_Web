import React from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router";
import "react-loading-skeleton/dist/skeleton.css";
import i18n from "../../../i18n";

function StatisticItem({ id, name, img_area, report }) {
  const navigate = useNavigate();
  const handleImageGardenClick = (deviceId) => {
    navigate(`/statistics/${deviceId}`);
  };
  const getLastValue = (arr) =>
    Array.isArray(arr) && arr.length > 0
      ? Number(arr[arr.length - 1]).toFixed(1)
      : "0.0";

  return (
    <div className="w-[32%] h-1/4 rounded-2xl border-2 shadow-xl bg-white flex">
      <div className="w-1/2 aspect-square rounded-xl border-r-2 transition-transform hover:scale-105 overflow-hidden">
        <img
          src={img_area || require("../../../assets/images/ItemImg.png")}
          alt="Garden"
          className="w-full h-full object-cover cursor-pointer rounded-xl "
          onClick={() => handleImageGardenClick(id)}
        />
      </div>

      <div className="w-3/5 p-2 flex flex-col justify-between">
        {/* Header */}
        <div className="m-1 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-green-800 truncate">
            {name}
          </h1>
          <img
            src={require("../../../assets/images/TreePlanting.png")}
            className="w-6 h-6 cursor-pointer hover:opacity-80"
            alt="edit"
          />
        </div>
        <hr className="my-1 border-t-1 border-gray-300" />
        {/* Report Data */}
        <div className="my-1 text-gray-700 space-y-1 font-medium text-l">
          {/* Each Item */}
          {[
            {
              label: i18n.t("soilMoisture"),
              label_icon: "💧",
              value: getLastValue(report?.humidity_avg),
              unit: "%",
            },
            {
              label: i18n.t("skyHumidity"),
              label_icon: "🌊",
              value: getLastValue(report?.moisture_avg),
              unit: "%",
            },
            {
              label: i18n.t("temperature"),
              label_icon: "🌡️",
              value: getLastValue(report?.tempurature_avg),
              unit: "°C",
            },
            // {
            //   label: i18n.t("light"),
            //   label_icon: "🔆",
            //   value: getLastValue(report?.luminosity_avg),
            //   unit: "lux",
            // },
          ].map((item, index) => (
            <div key={index} className="flex justify-between">
              {/* Icon and Label */}
              <h2 className="w-4/5 font-medium text-gray-600 flex items-center">
                <span className="mr-2">{item.label_icon}</span>
                <span>{item.label}:</span>
              </h2>
              {/* Value and Unit */}
              <div className="w-1/5 flex justify-end items-center">
                <h2 className="text-xl text-left font-semibold text-green-600">
                  {item.value}
                </h2>
                <h2 className="text-xl font-semibold w-1/4 text-center text-green-600 mx-2">
                  {item.unit}
                </h2>
              </div>
            </div>
          ))}

          {/* Water Usage */}
          <div key="waterUsage" className="flex justify-between items-center">
            <h2 className="w-4/5 font-medium text-gray-600 flex items-center">
              <span className="mr-2">🚿</span> {/* Icon */}
              <span>{i18n.t("water_usage")}:</span> {/* Label */}
            </h2>

            {/* Value and Unit */}
            <div className="w-1/5 flex justify-end items-center">
              {report?.water_usage != null ? (
                <>
                  <h2 className="text-xl font-semibold text-green-600">
                    {report.water_usage.toFixed(2)}
                  </h2>
                  <h2 className="text-xl font-semibold w-1/4 text-center text-green-600 mx-2">
                    L
                  </h2>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-green-600">0.0</h2>
                  <h2 className="text-xl font-semibold w-1/4 text-center text-green-600 ml-2">
                    L
                  </h2>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatisticItemSkeleton() {
  return (
    <div className="w-[32%] h-1/2 rounded-xl border-2 shadow-lg bg-white flex overflow-hidden">
      <div className="p-2 w-2/5 bg-gray-200 rounded-xl border-r-2">
        <Skeleton height="100%" width="100%" />
      </div>
      <div className="w-3/5 p-2 flex flex-col justify-between">
        <div className="m-1 flex justify-between items-center">
          <Skeleton width="60%" height={20} />
          <Skeleton circle width={30} height={30} />
        </div>

        <div className="m-1 p-2 space-y-2 text-gray-700">
          <div className="px-2 flex justify-between items-center">
            <Skeleton width="40%" height={20} />
            <Skeleton width="30%" height={20} />
          </div>
          <div className="px-2 flex justify-between items-center">
            <Skeleton width="40%" height={20} />
            <Skeleton width="30%" height={20} />
          </div>
        </div>

        <div className=" m-1 p-2 space-y-1 text-gray-700">
          <div className="px-2 flex justify-between items-center">
            <Skeleton width="40%" height={20} />
            <Skeleton circle width={30} height={30} />
          </div>
          <div className="px-2 flex justify-between items-center">
            <Skeleton width="40%" height={20} />
            <Skeleton circle width={30} height={30} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { StatisticItem, StatisticItemSkeleton };
