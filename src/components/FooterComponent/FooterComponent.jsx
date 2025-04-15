import React from "react";
import { Link } from "react-router";

function FooterComponent() {
  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-full px-6">
        <div className="flex items-center justify-center h-16 border-t border-gray-200">
          <div className="flex items-center gap-3 text-xl text-gray-700">
            <span>©</span>
            <span>GreenSprout</span>
            <span>|</span>
            <span>Privacy Policy</span>
            <span>|</span>
            <img
              src={require("../../assets/images/TreePlanting.png")}
              className="w-8 h-8 object-contain"
              alt="logo"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;
