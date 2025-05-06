import { ChartColumnIncreasing, User, Pencil, Trash } from "lucide-react";
export const GardenTitle = ({
  gardenName = "Unnamed Garden",
  areaGardenName = "Unknown Area",
  onEdit,
  onDelete,
  onMember,
  isOwner,
  deviceId,
  onStatistic,
}) => (
  <div className="relative m-5 text-center p-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-xl shadow-2xl">
    {/* Title */}
    <h1 className="text-4xl font-bold text-white mb-3">{gardenName}</h1>
    {isOwner && <p className="text-2sm text-gray-200 mb-2">ID: {deviceId}</p>}
    <h2 className="text-2xl text-gray-200 tracking-wide">{areaGardenName}</h2>
    {/* Buttons */}
    <div className="absolute top-2 right-4 flex flex-col space-y-2">
      {onStatistic && (
        <button
          onClick={onStatistic}
          className="group bg-white hover:bg-violet-400 p-2 rounded-full transition"
          title="See garden statistics"
        >
          <ChartColumnIncreasing
            size={18}
            className="text-violet-500 group-hover:text-white transition"
          />
        </button>
      )}
      {onMember && (
        <button
          onClick={onMember}
          className="group bg-white hover:bg-blue-400 p-2 rounded-full transition"
          title="See garden members"
        >
          <User
            size={18}
            className="text-blue-400 group-hover:text-white transition"
          />
        </button>
      )}
      {isOwner && onEdit && (
        <button
          onClick={onEdit}
          className="group bg-white hover:bg-green-400 p-2 rounded-full transition"
          title="Change garden name"
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
          title="Leave garden"
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
