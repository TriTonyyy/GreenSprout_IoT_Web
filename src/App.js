import "./App.css";
import { Routes, Route, Navigate, Outlet } from "react-router";
import HomePage from "./pages/homePage/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import DetailedGardenPage from "./pages/detailedGardenPage/DetailedGardenPage";
import AuthEmail from "./pages/auth/AuthEmail";
import AccountPage from "./pages/account/AccountPage";
import { getRole, getToken } from "./helper/tokenHelper";
import { useEffect, useState } from "react";
import StatisticsPage from "./pages/statisticsPage/StatisticPage";
import StatisticsDashboard from "./pages/statisticsPage/StatisticsDashboard";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminMangeUser from "./pages/admin/AdminMangeUser";
import AdminStatisticPage from "./pages/admin/AdminStatisticPage";


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

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<AuthPage isLogin={true} />} />
      <Route path="/register" element={<AuthPage isLogin={false} />} />
      <Route path="/register-email" element={<AuthEmail isTypeOTP={false} />} />
      <Route path="/otp" element={<AuthEmail isTypeOTP={true} />} />

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
          <Route path="/admin/detailUser/:id" element={<AccountPage/>}/>

        </Route>
      </Route>

      
    </Routes>
  );
}

export default App;
