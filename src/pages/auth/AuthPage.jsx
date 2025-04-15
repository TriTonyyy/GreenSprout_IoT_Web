import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { loginApi } from "../../api/authApi";
import { deviceDetect } from "react-device-detect";
import { UserCredential, tokenUser } from "../../redux/Reducers/AuthReducer";
import { getUserCredential } from "../../redux/selectors/authSelectors";
import { setToken } from "../../helper/tokenHelper";
import { apiResponseHandler } from "../../components/Alert/alertComponent";
import i18n from "../../i18n";

function AuthPage({ isLogin }) {
  const userCre = useSelector(getUserCredential);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(userCre?.email ? userCre.email : "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const deviceInfo = deviceDetect();

  const signIn = () => {
    dispatch(UserCredential({ email, password, name }));
    loginApi({ email, password, deviceID: deviceInfo.userAgent })
      .then((res) => {
        setToken(res.data);
        dispatch(tokenUser(res.data.data));
        navigate("/home");
      })
      .catch((err) => {
        apiResponseHandler(err.response.data.message,"error");
      });
  };

  const register = () => {
    dispatch(UserCredential({ email, password, name }));
    navigate("/register-email");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      isLogin ? signIn() : register();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-bgPurple ">
      <div className="bg-white p-10 rounded-2xl shadow-lg">
        <div className="p-10">
          <h1 className="text-5xl font-bold">
            {isLogin ? `${i18n.t("login")}` : `${i18n.t("register")}`}
          </h1>
        </div>
        <div className="input-box flex flex-col">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
            type="text"
            placeholder={i18n.t("email-placeholder")}
            className="border-2 border-gray-300 p-2 mt-2 mr-2 mb-2 rounded-lg bg-gray-100 w-full"
          />
          {!isLogin && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyPress}
              type="text"
              placeholder={i18n.t("username-placeholder")}
              className="border-2 border-gray-300 p-2 mt-2 mr-2 mb-2 rounded-lg bg-gray-100 w-full"
            />
          )}
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            type="password"
            placeholder={i18n.t("pass-placeholder")}
            className="border-2 border-gray-300 p-2 mt-2 mr-2 mb-2 rounded-lg bg-gray-100 w-full"
          />
          {isLogin && (
            <a href="/" className="p-1 m-1">
              {i18n.t("forgot-pass")}
            </a>
          )}
          <button
            className="bg-blue-500 text-white p-2 m-2 rounded-xl bg-purple"
            onClick={isLogin ? signIn : register}
          >
            {isLogin ? `${i18n.t("login")}` : `${i18n.t("register")}`}
          </button>
          <div className="flex justify-center items-center">
            <div className="w-5/12 h-px bg-slate-400"></div>
            <p className="w-full text-center text-slate-400">
              {i18n.t("or-auth-with")}
            </p>
            <div className="w-5/12 h-px bg-slate-400"></div>
          </div>
          <button className="bg-blue-500 text-white p-2 m-2 rounded-xl bg-red">
            Google
          </button>
          {isLogin ? (
            <h2 className="p-1 m-1">
              {i18n.t("did-not-have-account")}{" "}
              <a href="/register" className="text-stone-950 font-bold">
                {i18n.t("register")}
              </a>
            </h2>
          ) : (
            <h2 className="p-1 m-1">
              {i18n.t("did-not-have-account")}{" "}
              <a href="/login" className="text-stone-950 font-bold">
                {i18n.t("login")}
              </a>
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
