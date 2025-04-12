import React from "react";
import { NavLink, useNavigate } from "react-router"; // Import useNavigate for redirection
import { Home, BarChart2, Settings, Leaf, LogOut } from "lucide-react";
import { logOutAPI } from "../../api/AuthApi";
import { apiResponseHandler, areUSurePopup } from "../Alert/alertComponent";
import { removeToken } from "../../helper/tokenHelper";
import i18n from "../../i18n";

const SideNavigationBar = () => {
  const navigate = useNavigate(); // Get the navigate function

  const handleLogout = async () => {
    areUSurePopup(i18n.t("logout-confirm"))
      .then(async(res)=>{
        await logOutAPI()
          .then((res)=>{
            removeToken();
            navigate("/login")
          })
          .catch((err)=>{
            apiResponseHandler(err)
          })
      })
      .catch((err)=>{
        apiResponseHandler(err)
      })
  };

  return (
    <aside className="bg-green-700 text-white w-80 p-6 flex flex-col">
      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4 flex-grow">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            "flex items-center space-x-3 px-4 py-3 rounded transition-colors " +
            (isActive ? "bg-green-600" : "hover:bg-green-600")
          }
        >
          <Home size={20} />
          <span>Trang chủ</span>
        </NavLink>
        <NavLink
          to="/gardens"
          className={({ isActive }) =>
            "flex items-center space-x-3 px-4 py-3 rounded transition-colors " +
            (isActive ? "bg-green-600" : "hover:bg-green-600")
          }
        >
          <Leaf size={20} />
          <span>Thông tin khu vườn</span>
        </NavLink>
        <NavLink
          to="/statistics"
          className={({ isActive }) =>
            "flex items-center space-x-3 px-4 py-3 rounded transition-colors " +
            (isActive ? "bg-green-600" : "hover:bg-green-600")
          }
        >
          <BarChart2 size={20} />
          <span>Phân tích dữ liệu</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            "flex items-center space-x-3 px-4 py-3 rounded transition-colors " +
            (isActive ? "bg-green-600" : "hover:bg-green-600")
          }
        >
          <Settings size={20} />
          <span>Cài đặt</span>
        </NavLink>
      </nav>

      {/* Logout Option */}
      <div className="mt-auto">
        <button
          className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-green-600 transition-colors w-full"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNavigationBar;
