import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router";
import { getUserInfoAPI } from "../../api/authApi";
import { SearchBarComponent } from "./SearchBarComponent";
import { getRole } from "../../helper/tokenHelper";
import i18n from "../../i18n";

function HeaderComponent({ gardens }) {
  const headerFont = "Kodchasan";
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const role = getRole();

  useEffect(() => {
    getUserInfoAPI()
      .then((res) => {
        setUserName(res.data.name);
        setAvatar(res.data.avatar);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleIconClick = () => {
    if (role === "admin") {
      navigate("/admin/home");
    } else {
      navigate("/home");
    }
  };

  return (
    <header className="sticky top-0 bg-green-200 shadow-sm z-40">
      <div className="h-24 px-6">
        <div className="flex h-full items-center justify-between">
          {/* Left side - Logo and Brand */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleIconClick}
          >
            <img
              src={require("../../assets/images/TreePlanting.png")}
              className="h-14 w-14 object-contain"
              alt="logo"
            />
            <h1 className="text-3xl font-semibold text-green-600">
              GreenSprout
            </h1>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center gap-8">
            <SearchBarComponent gardens={gardens} />
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors duration-200"
              onClick={() => navigate("/account")}
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{i18n.t("account")}</p>
              </div>

              <div className="flex-shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    className="h-10 w-10 rounded-full border border-gray-200"
                    alt="avatar"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                    <User size={20} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
