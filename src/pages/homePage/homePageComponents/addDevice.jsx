import { Plus } from "lucide-react";
import React from "react";
import i18n from "../../../i18n";

const AddDeviceButton = ({ onClick }) => {
  return (
    <div className="text-center w-full flex flex-col items-center gap-6">
      {/* Message */}
      <p className="text-2xl text-gray-900 font-semibold leading-relaxed mb-4">
        {i18n.t("did-not-have-garden")}
      </p>

      {/* Button */}
      <div
        className="w-[350px] p-8 rounded-xl border-2 border-green-500 shadow-lg bg-gradient-to-r from-green-400 to-green-600 flex justify-center items-center cursor-pointer hover:bg-green-700 transition-all duration-300"
        onClick={onClick}
      >
        <div className="flex flex-col items-center">
          {/* Plus Icon with Circle Background */}
          <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center shadow-md mb-3">
            <Plus size={36} color="#34D399" />
          </div>
          {/* Button Text */}
          <p className="mt-3 text-white font-semibold text-xl">{i18n.t("add-garden")}</p>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceButton;
