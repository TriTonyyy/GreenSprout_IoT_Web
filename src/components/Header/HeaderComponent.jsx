import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import { getUserInfoAPI } from "../../api/AuthApi";

function SearchBarComponent() {
  const searchData = () => {
    // console.log("wqeqweq");
  };
  return (
    <div className="p-5 h-auto ">
      <div className="flex items-center bg-gray-100 rounded-lg">
        <input
          type="text"
          className="p-2 rounded-lg bg-gray-100"
          placeholder="Tìm kiếm"
        />
        <div onClick={searchData}>
          <Search size={48} className="p-2" />
        </div>
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
    <div className="flex items-center p-1 border-b-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <img
              src={require("../../assets/images/TreePlanting.png")}
              className="w-24 h-auto max-w-full"
              alt="logo"
            />
            <h1 className="text-4xl p-4" style={{ fontFamily: "fantasy" }}>
              GreenSprout
            </h1>
          </div>
        </div>
        <div className="flex items-center">
          <SearchBarComponent />
          <div
            className="flex items-center"
            onClick={() => {
              navigate("/account");
            }}
          >
            <h2 className="text-2xl p-4" style={{ fontFamily: headerFont }}>
              {userName}
            </h2>
            <img
              onClick={() => {
                console.log("dasd");
              }}
              src={require("../../assets/images/AvatarDefault.png")}
              className="w-18 h-auto max-w-full"
              alt="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderComponent;
