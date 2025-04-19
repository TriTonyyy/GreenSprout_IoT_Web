import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router";
import "react-loading-skeleton/dist/skeleton.css";

function StatisticItem({ id, name, img_area }) {
  const navigate = useNavigate();

  const handleImageGardenClick = (deviceId) => {
    navigate(`/garden/${deviceId}`);
  };

  return (
    <div className="w-[32%] h-1/4 rounded-2xl border-2 shadow-xl bg-white flex">
      <div className="p-3 w-1/2 bg-green-300 rounded-xl border-r-2">
        <img
          src={img_area || require("../../../assets/images/ItemImg.png")}
          alt="Garden"
          className="w-full h-full object-cover cursor-pointer rounded-xl transition-transform hover:scale-105"
          onClick={() => handleImageGardenClick(id)}
        />
      </div>
      <div className="w-3/5 p-2 flex flex-col justify-between">
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
        <div className="m-1 text-gray-700">
          
        </div>
        <hr className="my-1 border-t-1 border-gray-300" />
        <div className="text-gray-700">
          
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
