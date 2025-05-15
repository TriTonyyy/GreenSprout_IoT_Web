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
import { getGardenby, getGardenByDevice } from "../../api/deviceApi";

export default function AccountPage({ isDetail }) {
  const dispatch = useDispatch();
  const lang = useSelector(getLang);
  const [deviceData, setDeviceData] = useState(null);

  const [fileUpload, setFileUpload] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [avatar, setAvatar] = useState(userInfo.avatar);
  const [originalAvatar, setOriginalAvatar] = useState(userInfo.avatar);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [numOfGarden, setNumOfGarden] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const role = getRole();
  const isDisable = role === "admin" ? true : false;
  const saveUpdateUserInfo = async () => {
    setIsLoading(true);

    try {
      if (
        name === userInfo.name &&
        phone === userInfo.phone &&
        address === userInfo.address &&
        gender === userInfo.gender
      ) {
        apiResponseHandler(i18n.t("info_update_save"));
      } else {
        await updateProfileApi({ name, phone, address, gender })
          .then(async (res) => {
            setUserInfo(res.data);
            await updateAvatarAPI(fileUpload)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
            apiResponseHandler(res.message);
          })
          .catch((err) => {
            console.log(err);
          });

        window.location.reload();
      }
    } catch (err) {
      apiResponseHandler(
        err?.response?.data?.message || "Error updating profile",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (language) => {
    areUSurePopup(i18n.t("change-lang-mess"))
      .then((res) => {
        i18n.changeLanguage(language).then((t) => {
          t("key");
          dispatch(setLanguage(language));
        });
      })
      .catch((err) => {});
  };

  const changePassword = async () => {
    try {
      await changePasswordPopUp(
        i18n.t("changePassword"),
        async ({ oldPassword, password }) => {
          const res = await changePasswordAPI({
            currentPassword: oldPassword,
            newPassword: password,
          });
          return { success: true }; // Only return success if no error
        }
      );
      apiResponseHandler("Password changed successfully");
    } catch (err) {
      // This will only catch if the modal is closed via cancel or errors thrown in the popup
      apiResponseHandler(
        err?.response?.data?.message || "Error changing password",
        "error"
      );
    }
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      // If user canceled the file picker, revert to the original image
      setAvatar(originalAvatar); // <-- make sure you have this originalAvatar stored
      setFileUpload(null);
      return;
    }

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
  };

  const fetchDataSearch = async () => {
    const deviceResponse = await getGardenby();
    const deviceIds = deviceResponse.data || [];
    if (deviceIds.length === 0) {
      setDeviceData([]); // No devices found
      return;
    }

    // Fetch all devices concurrently
    const devicePromises = deviceIds.map(async (deviceId) => {
      try {
        const res = await getGardenByDevice(deviceId);
        return res?.data || null;
      } catch (err) {
        apiResponseHandler(err); // Handle error response
        return null;
      }
    });

    const deviceResponses = await Promise.all(devicePromises);
    setDeviceData(deviceResponses.filter((device) => device !== null)); // Remove failed devices
  };

  useEffect(() => {
    if (id !== undefined) {
      getDetailUserById(id)
        .then((res) => {
          setUserInfo(res.data);
          setAvatar(res.data.avatar || "");
          setOriginalAvatar(res.data.avatar || "");
        })
        .catch((err) => console.log(err));
    } else {
      getUserInfoAPI()
        .then((res) => {
          setUserInfo(res.data);
          setAvatar(res.data.avatar || "");
          setOriginalAvatar(res.data.avatar || "");
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    fetchDataSearch();
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

  const banUser = () => {
    banUserAPI({ id: id })
      .then((res) => {
        console.log(res);
        apiResponseHandler(res.message, "success");
      })
      .catch((err) => {
        apiResponseHandler(err.response.data.message, "error");
      });
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-200">
      <HeaderComponent gardens={deviceData || []} />
      <div className="flex flex-1">
        <SideNavigationBar />
        <div className="flex-1 p-4 lg:p-12 w-full max-w-7xl mx-auto ">
          <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-800 ">
            {i18n.t("account")}
          </h1>
          {/* Avatar Section */}
          <div className="bg-white p-8 pb-0 rounded-xl rounded-b-none shadow-lg">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-black text-center">
              {i18n.t("personal_info")}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Avatar and Upload Section in a row */}
              <div className="flex flex-row items-center justify-start space-x-8">
                <div className="flex justify-center lg:justify-start">
                  <img
                    src={
                      avatar || require("../../assets/images/AvatarDefault.png")
                    }
                    alt="Avatar"
                    className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-gray-200"
                  />
                </div>

                <div className="py-4">
                  <label className="block text-lg font-medium text-gray-800 mb-2">
                    {i18n.t("avatar_des")}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImgUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="inline-block cursor-pointer text-lg font-semibold text-blue-800 bg-blue-100 px-6 py-3 rounded-lg transition hover:bg-blue-200"
                  >
                    {i18n.t("upload_button_text")}
                  </label>
                </div>
              </div>
              <div className="flex flex-row items-center justify-start space-x-8">
                {/* Settings Section */}
                {!isDetail && (
                  <div className= "py-4 rounded-lg w-fit">
                    <h2 className="block text-lg font-medium text-gray-800 mb-3">
                      {i18n.t("update_pass")}
                    </h2>
                    <div className="flex flex-col">
                      <button
                        onClick={changePassword}
                        className="bg-green-600 text-white py-3 text-lg rounded-lg hover:bg-green-700 transition disabled:bg-green-400"
                      >
                        {isLoading
                          ? "Processing..."
                          : i18n.t("change-password")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Info Form */}
          <div className="bg-white p-8 rounded-xl rounded-t-none shadow-lg">
            {/* <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-gray-700">
              {i18n.t("personal_info")}
            </h2> */}
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
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)} // Make sure setGender is defined in your component
                  disabled={isDisable}
                  className={`mt-2 block w-full p-4 text-lg border rounded-lg ${
                    isDisable
                      ? "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
                      : "bg-white text-black border-gray-400"
                  }`}
                >
                  <option value="male">{i18n.t("male")}</option>
                  <option value="female">{i18n.t("female")}</option>
                  <option value="other">{i18n.t("other")}</option>
                </select>
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
                  disabled={isDisable}
                  className="mt-2 block w-full p-4 text-lg border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* <div>
                  <label className="block text-lg font-medium text-gray-700">
                    {i18n.t("language")}
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="mt-2 block w-full lg:w-1/2 p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                  </select>
                </div> */}

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
      {/* <FooterComponent /> */}
    </div>
  );
}
