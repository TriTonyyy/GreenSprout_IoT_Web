import React, { useState } from "react";
import { ChartColumnIncreasing, User, Pencil, Trash, Eye } from "lucide-react";
import i18n from "../../../i18n";
export const GardenTitle = ({
  gardenName = "Unnamed Garden",
  areaGardenName = "Unknown Area",
  onEdit,
  onDelete,
  onMember,
  isOwner,
  deviceId,
  onStatistic,
}) => {
  const [showId, setShowId] = useState(false);

  const handleMouseDown = () => setShowId(true);
  const handleMouseUp = () => setShowId(false);
  const handleMouseLeave = () => setShowId(false);
  //bg-gradient-to-r from-green-400 via-green-500 to-green-600

  return (
    <div className="relative m-5 text-center px-8 py-4 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-xl shadow-2xl grid grid-cols-12 gap-4">
      <div className="col-span-11 flex flex-col justify-center space-y-3">
        <h1 className="text-4xl font-bold text-white">{gardenName}</h1>
        {isOwner && (
          <div className="flex items-center justify-center gap-2 m-2 text-gray-200">
            <span className="text-2sm w-[150px] font-mono overflow-hidden text-ellipsis text-center font-bold">
              ID: {showId ? deviceId : "********"}
            </span>
            <button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              className="p-1 rounded-full hover:bg-white/20 transition"
              title="Hold to reveal ID"
            >
              <Eye size={18} className="text-white" />
            </button>
          </div>
        )}

        <h2 className="text-2xl text-gray-200 tracking-wide">
          {areaGardenName}
        </h2>
      </div>

      {/* Buttons */}
      <div className="col-span-1 flex flex-col font-bold justify-between space-y-2">
        {onStatistic && (
          <button
            onClick={onStatistic}
            className="group w-full bg-violet-400 hover:bg-white p-2 rounded-full transition-all flex items-center justify-between"
            title="See garden statistics"
          >
            <span className="text-sm text-white group-hover:text-violet-500 transition duration-300 whitespace-nowrap">
              {i18n.t("statistics")}
            </span>
            <ChartColumnIncreasing
              size={16}
              className="text-white group-hover:text-violet-500 transition"
            />
          </button>
        )}
        {onMember && (
          <button
            onClick={onMember}
            className="group w-full bg-blue-400 hover:bg-white p-2 rounded-full transition-all flex items-center justify-between"
            title="See garden members"
          >
            <span className="text-sm text-white group-hover:text-blue-400 transition duration-300 whitespace-nowrap">
              {i18n.t("members")}
            </span>
            <User
              size={16}
              className="text-white group-hover:text-blue-400 transition"
            />
          </button>
        )}
        {isOwner && onEdit && (
          <button
            onClick={onEdit}
            className="group w-full bg-green-400 hover:bg-white p-2 rounded-full transition-all flex items-center justify-between"
            title="Change garden name"
          >
            <span className="text-sm text-white group-hover:text-green-400 transition duration-300 whitespace-nowrap">
              {i18n.t("rename")}
            </span>
            <Pencil
              size={16}
              className="text-white group-hover:text-green-400 transition"
            />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="group w-full bg-rose-600 hover:bg-white p-2 rounded-full transition-all flex items-center justify-between"
            title="Leave garden"
          >
            <span className="text-sm text-white group-hover:text-rose-600 transition duration-300 whitespace-nowrap">
              {i18n.t("leave")}
            </span>
            <Trash
              size={16}
              className="text-white group-hover:text-rose-600 transition"
            />
          </button>
        )}
      </div>
    </div>
  );
};

{
  /* <div className="col-span-1 h-full min-h-[200px] flex flex-col space-y-2">
        <h2 className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Thành viên
        </h2>
        <div className="flex flex-col">
          <MemberSection
            members={gardenData.members}
            onEdit={handleRemoveMember}
            isOwner={isOwner}
          />
        </div>
      </div> */
}

export const GardenTitleSkeleton = () => (
  <div className="relative mx-5 my-2 text-center p-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-xl shadow-2xl animate-pulse">
    {/* Skeleton Titles */}
    <div className="h-10 w-1/2 mx-auto bg-white/40 rounded mb-4" />
    <div className="h-6 w-1/3 mx-auto bg-white/30 rounded" />

    {/* Placeholder Buttons */}
    <div className="absolute top-4 right-4 flex space-x-2">
      <div className="h-9 w-9 rounded-full bg-white/60" />
      <div className="h-9 w-9 rounded-full bg-white/60" />
    </div>
  </div>
);
