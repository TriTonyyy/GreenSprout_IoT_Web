import React from "react";

const AddDeviceButton = ({ onClick }) => {
  return (
    <div
      className="w-[30%] h-2/3 rounded-xl border-2 shadow-lg bg-white flex justify-center items-center cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center text-3xl font-bold text-white">
          +
        </div>
        <p className="mt-2 text-gray-700 font-medium">Thêm thiết bị</p>
      </div>
    </div>
  );
};

export default AddDeviceButton;
