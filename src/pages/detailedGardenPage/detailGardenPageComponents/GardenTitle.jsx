import { Pencil, Trash } from "lucide-react";

export const GardenTitle = ({
  gardenName = "Unnamed Garden",
  areaGardenName = "Unknown Area",
  onEdit,
  onDelete,
  isOwner,
  deviceId,
}) => (

  <div className="relative m-5 text-center p-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-xl shadow-2xl">
    {/* Title */}
    <h1 className="text-4xl font-bold text-white mb-3">{gardenName}</h1>
    {isOwner && (
      <p className="text-2sm text-gray-200 mb-2">ID khu vườn: {deviceId}</p>
    )}
    <h2 className="text-2xl text-gray-200 tracking-wide">
      {areaGardenName}
    </h2>
    {/* Buttons */}
    <div className="absolute top-4 right-4 flex space-x-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="group bg-white hover:bg-green-400 p-2 rounded-full transition"
          title="Edit garden"
        >
          <Pencil
            size={18}
            className="text-green-400 group-hover:text-white transition"
          />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="group bg-white hover:bg-rose-600 p-2 rounded-full transition"
          title="Delete garden"
        >
          <Trash
            size={18}
            className="text-rose-600 group-hover:text-white transition"
          />
        </button>
      )}
    </div>
  </div>
);

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
