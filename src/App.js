import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { DetailedGardenInfo } from "./components/DetailedGardenInfo/DetailedGardenInfo"
import HomePage from "./pages/home/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import DetailedGardenPage from "./pages/detailed garden/DetailedGardenPage";
import AuthEmail from "./pages/auth/AuthEmail";
import SchedulePage from "./pages/schedule/SchedulePage";
import AccountPage from "./pages/account/AccountPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="login" element={<AuthPage isLogin={true} />} />
      <Route path="register" element={<AuthPage isLogin={false} />} />
      <Route path="home" element={<HomePage />} />
      <Route path="register-email" element={<AuthEmail isTypeOTP={false} />} />
      <Route path="otp" element={<AuthEmail isTypeOTP={true} />} />
      <Route path="/garden/:gardenId" element={<DetailedGardenPage />}/>
      <Route path="/schedule" element={<SchedulePage />}/>
      <Route path="/schedule" element={<SchedulePage />}/>
      <Route path="/account" element={<AccountPage />} />

    </Routes>
  );
}

export default App;
