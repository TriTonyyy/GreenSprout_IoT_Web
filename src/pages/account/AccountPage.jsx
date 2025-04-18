import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { useNavigate } from "react-router";
import { changePasswordAPI, getUserInfoAPI } from "../../api/authApi";
import { updateAvatarAPI, updateProfileApi } from "../../api/userApi";
import {
  apiResponseHandler,
  areUSurePopup,
  changePasswordPopUp,
} from "../../components/Alert/alertComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import i18n from "../../i18n";
import { setLanguage } from "../../redux/Reducers/langReducer";
import { getLang } from "../../redux/selectors/langSelectors";

export default function AccountPage() {
  const dispatch = useDispatch();
  const lang = useSelector(getLang);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [fileUpload, setFileUpload] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  const saveUpdateUserInfo = () => {
    updateProfileApi({ name, email })
      .then((res) => {
        setUserInfo(res.data);
        alert(res.message);
        window.location.reload();
      })
      .catch((err) => {
        apiResponseHandler(err);
      });
    updateAvatarAPI(fileUpload)
      .then((res)=>{
        apiResponseHandler(res.message)
      })
      .catch((err)=>{
        console.log(err);
        apiResponseHandler(err.response.data.message, "error");

      })
  };

  const changeLanguage = async (language) => {
    areUSurePopup(i18n.t("change-lang-mess"))
      .then((res) => {
        i18n.changeLanguage(language).then((t) => {
          t("key");
          dispatch(setLanguage(language));
        });
      })
      .catch(() => {});
  };

  const changePassword = async () => {
    await changePasswordPopUp().then((popupres) => {
      
      changePasswordAPI({
        currentPassword: popupres.oldPassword,
        newPassword: popupres.password,
      })
        .then((res) => {
          
          apiResponseHandler(res.message);
        })
        .catch((err) => {
          console.log(err);
          apiResponseHandler(err?.response?.data?.message, 'error');
        });
    });
  };

  const handleImgUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        apiResponseHandler("Ảnh vượt quá dung lượng tối đa 2MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setAvatar(base64);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append('avatar', file);
      setFileUpload(formData);
    }
  };

  useEffect(() => {
    getUserInfoAPI()
      .then((res) => {
        setUserInfo(res.data);
        setAvatar(res.data.avatar)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    setEmail(userInfo?.email ? userInfo.email : "");
    setName(userInfo?.name ? userInfo.name : "");
  }, [userInfo]);

  return (
    <div>
      <HeaderComponent />
      <div className="flex">
        <SideNavigationBar />
        <div className="mx-10 my-5 justify-between flex-col w-full">
          <h1 className="text-3xl">
            <strong>{i18n.t("account")}</strong>
          </h1>
          <div className="flex pt-5  justify-between items-center ">
            <div className="flex">
              <img
                src={
                  avatar !== ""
                    ? avatar
                    : require("../../assets/images/AvatarDefault.png")
                }
                className="py-5 max-w-lg"
                alt="avatar"
              />
              {avatar === "" ? (
                <h2 className="text-2xl p-4">
                  Ảnh cá nhân <br />
                  PNG, JPEG dưới 2MB <br />
                </h2>
              ) : (
                <></>
              )}
            </div>
            {/* <button className='bg-gray-300 p-5 rounded-2xl text-xl border-2 border-gray-500 hover:bg-gray-400'>
                        Tải hình ảnh lên
                    </button> */}

            <input type="file" onChange={(e) => handleImgUpload(e)} />
          </div>

          <div className="pt-5  justify-between items-center border-b-2 pb-4 ">
            <h2 className="text-2xl ">
              <strong>{i18n.t("fullname")}</strong>
            </h2>
            <input
              type="text"
              className="border-2 border-gray-300 p-2 mt-2 mr-2 mb-2 rounded-lg bg-gray-100 w-full"
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="pt-5  justify-between items-center border-b-2 pb-4 ">
            <h2 className="text-2xl">
              <strong>Email</strong>
            </h2>
            <input
              readOnly
              type="email"
              className="border-2 border-gray-300 p-2 mt-2 mr-2 mb-2 rounded-lg bg-gray-100 w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="pt-5  justify-between items-center border-b-2 pb-4 ">
            <h2 className="text-2xl ">
              <strong>{i18n.t("password")}</strong>
            </h2>
            <input
              readOnly
              type="password"
              className="border-2 border-gray-300 p-2 mt-2 mr-2 mb-2 rounded-lg bg-gray-100 w-full"
              placeholder="Mật Khẩu"
              value={"abcdefgh"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="p-4 rounded bg-green-600 mt-4"
              onClick={changePassword}
            >
              <p className="text-white text-2xl">{i18n.t("change-password")}</p>
            </button>
          </div>

          <div className="pt-5  justify-between items-center border-b-2 pb-4 ">
            <h2 className="text-2xl ">
              <strong>{i18n.t("lang")}</strong>
            </h2>
            <select
              className="border-2 border-gray-300 p-2 mt-2 mr-2 mb-2 rounded-lg bg-gray-100 w-full"
              onChange={(e) => changeLanguage(e.target.value)}
            >
              {lang === "vi" ? (
                <div>
                  <option selected value="vi">
                    Tiếng Việt
                  </option>
                  <option value="en">English</option>
                </div>
              ) : (
                <div>
                  <option value="vi">Tiếng Việt</option>
                  <option selected value="en">
                    English
                  </option>
                </div>
              )}
            </select>
          </div>

          <button
            className="w-full p-4 rounded bg-blue-400"
            onClick={saveUpdateUserInfo}
          >
            <p className="text-white text-2xl">{i18n.t("save")}</p>
          </button>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}
