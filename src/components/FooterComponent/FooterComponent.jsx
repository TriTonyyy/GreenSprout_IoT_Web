import React from "react";

function FooterComponent() {
  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-full">
        <div className="flex items-center justify-center h-24 border-t border-gray-200 py-6">
          <div className="flex items-center gap-4 text-[1.25rem] text-gray-700">
            <span>©</span>
            <span>GreenSprout</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>|</span>
            <img
              src={require("../../assets/images/TreePlanting.png")}
              className="w-10 h-10 object-contain"
              alt="logo"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;
