import React, { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router";
import { getUserInfoAPI } from "../../api/AuthApi";

function SearchBarComponent() {
  const searchData = () => {
    // console.log("wqeqweq");
  };
  return (
    <div className="relative">
      <input
        type="text"
        className="w-[400px] px-4 py-2 pl-10 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
        placeholder="Tìm kiếm..."
      />
      <div
        onClick={searchData}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      >
        <Search size={18} />
      </div>
    </div>
  );
}

function HeaderComponent({
  titleScheduleColor = "black",
  titleReportColor = "black",
}) {
  const headerFont = "Kodchasan";
  // const user = useSelector(getTokenUser);
  // console.log(user, "asdasdasd");
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");

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
  const navigate = useNavigate();
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="h-16 px-6">
        <div className="flex h-full items-center justify-between">
          {/* Left side - Logo and Brand */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <img
              src={require("../../assets/images/TreePlanting.png")}
              className="h-12 w-12 object-contain"
              alt="logo"
            />
            <h1 className="text-2xl font-semibold text-green-600">
              GreenSprout
            </h1>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center gap-8">
            <SearchBarComponent />

            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors duration-200"
              onClick={() => navigate("/account")}
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">Tài khoản</p>
              </div>

              <div className="flex-shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    className="h-9 w-9 rounded-full border border-gray-200"
                    alt="avatar"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
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
