import "./App.css";
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "react-router";
import HomePage from "./pages/homePage/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import DetailedGardenPage from "./pages/detailedGardenPage/DetailedGardenPage";
import AuthEmail from "./pages/auth/AuthEmail";
import AccountPage from "./pages/account/AccountPage";
import { getRole, getToken, removeToken } from "./helper/tokenHelper";
import { useEffect, useState, useRef } from "react";
import StatisticsPage from "./pages/statisticsPage/StatisticPage";
import StatisticsDashboard from "./pages/statisticsPage/StatisticsDashboard";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminMangeUser from "./pages/admin/AdminMangeUser";
import AdminStatisticPage from "./pages/admin/AdminStatisticPage";
import NewPassWordPage from "./pages/auth/NewPassWordPage";
import { apiResponseHandler } from "./components/Alert/alertComponent";
import i18n from "./i18n";


function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true = authenticated, false = unauthenticated
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();
        setIsAuthenticated(!!token); // Set to true if token exists, false otherwise
      } catch (error) {
        console.error("Error checking token:", error);
        setIsAuthenticated(false); // Treat errors as unauthenticated
      }
    };

    checkToken();
  }, []);

  // While checking token, show a loading state
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // You can customize this (e.g., a spinner)
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
}

function AdminRoute(){
  const [isAdmin, setIsAdmin] = useState(null);
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const role = await getRole();
        if(role === 'admin'){
          setIsAdmin(true);
        } else{
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

function App() {
  const limitWidth = 1300;
  const [width, setWidth] = useState(window.innerWidth);
  const prevWidth = useRef(window.innerWidth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWidth(currentWidth);
      prevWidth.current = currentWidth;

      if (currentWidth < limitWidth) {
        // Only log out if not already on login page
        if (location.pathname !== "/login") {
          removeToken(); // your custom logout logic
          apiResponseHandler(i18n.t("responsive_handle_text"), "error");
          navigate("/login", { replace: true });
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate, location]);
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<AuthPage isLogin={true} />} />
      <Route path="/register" element={<AuthPage isLogin={false} />} />
      <Route path="/register-email" element={<AuthEmail isTypeOTP={false} isForgetPassword={false} />} />
      <Route path="/forget-password" element={<AuthEmail isTypeOTP={false} isForgetPassword={true} />} />
      <Route path="/new-password" element={<NewPassWordPage/>} />


      <Route path="/otp-forget-pass" element={<AuthEmail isTypeOTP={true} isForgetPassword={true}/>} />
      <Route path="/otp" element={<AuthEmail isTypeOTP={true} isForgetPassword={false}/>} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/garden/:gardenId" element={<DetailedGardenPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/statistics" element={<StatisticsPage/>}/>
        <Route path="/statistics/:deviceId" element={<StatisticsDashboard/>} />
        <Route element={<AdminRoute/>}>
          <Route path="/admin/home" element={<AdminHomePage/>}/>
          <Route path="/admin/manage-user" element={<AdminMangeUser/>}/>
          <Route path="/admin/statistics" element={<AdminStatisticPage/>}/>
          <Route path="/admin/detailUser/:id" element={<AccountPage isDetail={true}/>}/>

        </Route>
      </Route>

      
    </Routes>
  );
}

export default App;
