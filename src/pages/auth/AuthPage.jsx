import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { loginApi } from "../../api/authApi";
import { deviceDetect } from "react-device-detect";
import { UserCredential, tokenUser } from "../../redux/Reducers/AuthReducer";
import { getUserCredential } from "../../redux/selectors/authSelectors";
import { setRole, setToken } from "../../helper/tokenHelper";
import { apiResponseHandler } from "../../components/Alert/alertComponent";
import i18n from "../../i18n";

function AuthPage({ isLogin }) {
  const [isLoading, setIsLoading ] = useState(false);
  const userCre = useSelector(getUserCredential);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(userCre?.email ? userCre.email : "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const deviceInfo = deviceDetect();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const signIn = () => {
    setIsLoading(true);
    if (!emailRegex.test(email)){
      apiResponseHandler(i18n.t("enter_valid_email"), "error")
    } else {
      dispatch(UserCredential({ email, password, name }));
      loginApi({ email, password, deviceID: deviceInfo.userAgent })
        .then((res) => {
          setIsLoading(false)
          setToken(res.data);
          setRole(res.role);
  
          dispatch(tokenUser(res.data.data));
          if(res.role === 'admin'){
            navigate("/admin/home");
          } else{
            navigate("/home");
          }
        })
        .catch((err) => {
          setIsLoading(false)
          apiResponseHandler(err.response.data.message,"error");
        });
    }
  };

  const register = () => {
    setIsLoading(true)
    if (password.length < 8) {
      setIsLoading(false)
      apiResponseHandler(i18n.t("password_min_length"), "error")
    } else if (!emailRegex.test(email)){
      setIsLoading(false)
      apiResponseHandler(i18n.t("enter_valid_email"), "error")
    } else if(!name){
      setIsLoading(false)
      apiResponseHandler(i18n.t("enter_valid_username"), "error")
    } else {
      setIsLoading(false)
      dispatch(UserCredential({ email, password, name }));
      navigate("/register-email");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (password.length < 8) {
        apiResponseHandler(i18n.t("password_min_length"), "error")
      } else {
        isLogin ? signIn() : register();
      }
    }
  };

  const googleHandle=async()=>{
    // await googleAuthAPI()
    //   .then((res)=>{
    //     console.log(res,'res');
        
    //   })
    //   .catch((err)=>{
    //     console.log(err);
        
    //   })
    // window.location.href = "https://capstone-project-iot-1.onrender.com/api/user/google";
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-green-600">
      <div className="bg-green-50 p-10 rounded-2xl shadow-lg">
        <div className="flex justify-center cursor-pointer">
          <img src={require("../../assets/images/TreePlanting.png")} className="h-50 w-50 object-contain" alt="logo"/>
        </div>
        <div className="p-10">
          <h1 className="text-5xl font-bold text-center">
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
            <a href="/forget-password" className="p-1 m-1">
              {i18n.t("forgot-pass")}
            </a>
          )}
          <button
          disabled={isLoading}
            className="bg-blue-500 text-white p-2 m-2 rounded-xl bg-green-700"
            onClick={isLogin ? signIn : register}
          >
            {isLogin ? `${i18n.t("login")}` : `${i18n.t("register")}`}
          </button>
          <div className="flex justify-center items-center">
            {/* <div className="w-5/12 h-px bg-slate-400"></div>
            <p className="w-full text-center text-slate-400">
              {i18n.t("or-auth-with")}
            </p>
            <div className="w-5/12 h-px bg-slate-400"></div> */}
          </div>
          {/* <button className="bg-blue-500 text-white p-2 m-2 rounded-xl bg-red" onClick={googleHandle}>
            Google
          </button> */}
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
        <div className="w-[10%] self-start bottom-0 left-0 absolute ml-10 mb-10 rounded bg-green-800 text-center p-4 rounded-2xl">
          <img className="w-full rounded" src={require("../../assets/images/QR-code.jpg")}/>
          <h1 className="w-full text-white font-semibold text-center w-1/10 h-1/10 mt-4">{i18n.t("qr_caption")}</h1>
        </div>
    </div>
  );
}

export default AuthPage;
