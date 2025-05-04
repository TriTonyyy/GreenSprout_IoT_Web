import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { useNavigate, useParams } from "react-router";
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
import { banUserAPI, getDetailUserById } from "../../api/adminApi";
import { getRole } from "../../helper/tokenHelper";

export default function AccountPage({isDetail}) {
  const dispatch = useDispatch();
  const lang = useSelector(getLang);
  const [avatar, setAvatar] = useState("");
  const [fileUpload, setFileUpload] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [numOfGarden, setNumOfGarden] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {id} = useParams();
  const role = getRole();
  const isDisable = role ==='admin' ? true :false;
  const saveUpdateUserInfo = async () => {
    setIsLoading(true);
    try {
      const profileRes = await updateProfileApi({ name, email });
      setUserInfo(profileRes.data);
      await updateAvatarAPI(fileUpload);
      apiResponseHandler(profileRes.message);
      window.location.reload();
    } catch (err) {
      apiResponseHandler(err?.response?.data?.message || "Error updating profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (language) => {
    areUSurePopup(i18n.t("change-lang-mess")).then((res) => {
      i18n.changeLanguage(language).then((t) => {
        t("key");
        dispatch(setLanguage(language));
      });
    });
  };

  const changePassword = async () => {
    try {
      const popupRes = await changePasswordPopUp();
      await changePasswordAPI({
        currentPassword: popupRes.oldPassword,
        newPassword: popupRes.password,
      });
      apiResponseHandler("Password changed successfully");
    } catch (err) {
      apiResponseHandler(err?.response?.data?.message || "Error changing password", "error");
    }
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        apiResponseHandler("Image exceeds 5MB limit", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("avatar", file);
      setFileUpload(formData);
    }
  };

  useEffect(() => {
    if(id !== undefined){
      getDetailUserById(id)
      .then((res) => {
        setUserInfo(res.data);
        setAvatar(res.data.avatar || "");
      })
      .catch((err) => console.log(err));
    } else {
      getUserInfoAPI()
        .then((res) => {
          setUserInfo(res.data);
          setAvatar(res.data.avatar || "");
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    setEmail(userInfo?.email || "");
    setName(userInfo?.name || "");
    setAddress(userInfo?.address || "Not updated");
    setGender(userInfo?.gender || "Not updated");
    setPhone(userInfo?.phone || "Not updated");
    setStatus(userInfo?.status || "Active");
    setNumOfGarden(userInfo?.gardenId?.length || 0);
  }, [userInfo]);

  const banUser = ()=>{
    banUserAPI({id:id})
    .then((res)=>{
      console.log(res);
      apiResponseHandler(res.message, 'success')
    })
    .catch((err)=>{
      apiResponseHandler(err.response.data.message, 'error')
    })
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-200">
      <HeaderComponent />
      <div className="flex flex-1">
        <SideNavigationBar />
        <div className="flex-1 p-8 lg:p-12 w-full max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-800">
            {i18n.t("account")}
          </h1>
          {/* Avatar Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-gray-700">
              {i18n.t("avatar")}
            </h2>
            <div className="flex items-center space-x-8">
              <img
                src={avatar || require("../../assets/images/AvatarDefault.png")}
                alt="Avatar"
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-gray-200"
              />
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  {i18n.t("avatar_des")}
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImgUpload}
                  className="block w-full text-lg text-gray-500 file:mr-6 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-lg file:font-semibold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200 transition"
                />
              </div>
            </div>
          </div>

          {/* User Info Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-gray-700">
              {i18n.t("personal_info")}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  {i18n.t("fullname")}
                </label>
                <input
                  disabled={isDisable}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2 block w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Email
                </label>
                <input
                  disabled={isDisable}
                  type="email"
                  value={email}
                  readOnly
                  className="mt-2 block w-full p-4 text-lg border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  {i18n.t("address")}
                </label>
                <input
                  disabled={isDisable}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="mt-2 block w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  {i18n.t("gender")}
                </label>
                <input
                  type="text"
                  value={gender}
                  readOnly
                  className="mt-2 block w-full p-4 text-lg border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  {i18n.t("phone")}
                </label>
                <input
                  disabled={isDisable}
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-2 block w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  {i18n.t("num_garden")}
                </label>
                <input
                  type="number"
                  value={numOfGarden}
                  readOnly
                  className="mt-2 block w-full p-4 text-lg border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password and Language */}
            {!isDetail  && (

            <div className="mt-8">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-gray-700">
                {i18n.t("setting")}
              </h2>
              <div className="flex flex-col space-y-6">
                <button
                  onClick={changePassword}
                  className="w-full lg:w-1/2 bg-green-600 text-white py-4 text-lg rounded-lg hover:bg-green-700 transition disabled:bg-green-400"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : i18n.t("change-password")}
                </button>
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    {i18n.t("language")}
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="mt-2 block w-full lg:w-1/2 p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
            )}

            {/* Save Button */}
            {!isDetail ? (
              <button
                onClick={saveUpdateUserInfo}
                className="mt-8 w-full bg-blue-600 text-white py-4 text-lg rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : i18n.t("save")}
              </button>
            ) : (
              <button
                onClick={banUser}
                className="mt-8 w-full bg-red text-white py-4 text-lg rounded-lg hover:bg-red-700 transition"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Ban"}
              </button>
            )}
            
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}
