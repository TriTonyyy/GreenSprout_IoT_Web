import { Pencil, Trash } from "lucide-react";
export const GardenTitle = ({
  gardenName = "Unnamed Garden",
  areaGardenName = "Unknown Area",
  onEdit,
  onDelete,
}) => (
  <div className="relative mx-5 my-2 text-center p-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-xl shadow-2xl">
    {/* Title */}
    <h1 className="text-4xl font-bold text-white">{gardenName}</h1>
    <h2 className="text-2xl text-gray-200 mt-3 tracking-wide">
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
