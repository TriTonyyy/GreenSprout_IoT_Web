import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { Home, BarChart2, Settings, LogOut, User } from "lucide-react";
import { logOutAPI } from "../../api/authApi";
import { apiResponseHandler, areUSurePopup } from "../Alert/alertComponent";
import { removeToken, getRole } from "../../helper/tokenHelper";
import i18n from "../../i18n";
import { setLanguage } from "../../redux/Reducers/langReducer";
import { getLang } from "../../redux/selectors/langSelectors";

const SideNavigationBar = () => {
  const navigate = useNavigate();
  const userRole = getRole();
  const dispatch = useDispatch();
  const lang = i18n.language;


  const handleLogout = async () => {
    areUSurePopup(i18n.t("logout-confirm"))
      .then(async (res) => {
        await logOutAPI()
          .then((res) => {
            removeToken();
            navigate("/login");
          })
          .catch((err) => {
            apiResponseHandler(err);
          });
      })
      .catch((err) => {
        // apiResponseHandler(err)
      });
  };

  const changeLanguage = async (language) => {
      areUSurePopup(i18n.t("change-lang-mess"))
      .then((res) => {
        i18n.changeLanguage(language).then((t) => {
          t("key");
          // dispatch(setLanguage(language));
          console.log(12131);
          
        });
      })
      .catch((err)=>{
        
      })
    };

  const roleBasedItems = {
    admin: [
      { path: "/admin/home", icon: <Home size={20} />, label: i18n.t('home') },
      {
        path: "/admin/statistics",
        icon: <BarChart2 size={20} />,
        label: i18n.t('data_analys'),
      },
      { path: "/admin/manage-user", icon: <User size={20} />, label: i18n.t('admin_user') },
    ],
    user: [
      { path: "/home", icon: <Home size={20} />, label: i18n.t('home')},
      {
        path: "/statistics",
        icon: <BarChart2 size={20} />,
        label: i18n.t('data_analys'),
      },
      { path: "/account", icon: <Settings size={20} />, label: i18n.t('setting') },
      
    ],
    guest: [],
  };
  const navItems = [...(roleBasedItems[userRole] || [])];
  // console.log(userRole);

  // console.log(navItems);

  // const navItems = [
  //   { path: "/home", icon: <Home size={20} />, label: "Trang chủ" },
  //   {
  //     path: "/statistics",
  //     icon: <BarChart2 size={20} />,
  //     label: "Phân tích dữ liệu",
  //   },
  //   { path: "/account", icon: <Settings size={20} />, label: "Cài đặt" },
  // ];

  return (
    <aside className="w-80 bg-gradient-to-b from-green-700 to-green-600 text-white min-h-screen flex flex-col shadow-xl">
      {/* Navigation Links */}
      <nav className="flex-grow px-4 pt-6">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white font-medium shadow-sm"
                    : "text-gray-100 hover:bg-white/5"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div>
          {/* <label className="block text-lg font-medium text-gray-700">
            {i18n.t("language")}
          </label> */}
          <select
            value={lang}
            onChange={(e) => changeLanguage(e.target.value)}
            className="mt-2 block w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
          >
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>
      </nav>

      {/* Divider */}
      <div className="px-6 py-4">
        <div className="h-px bg-white/10"></div>
      </div>

      {/* Logout Option */}
      <div className="px-4 pb-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-100 hover:bg-white/5 transition-all duration-200"
        >
          <span className="text-lg">
            <LogOut size={20} />
          </span>
          <span className="font-medium">{i18n.t("logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNavigationBar;
