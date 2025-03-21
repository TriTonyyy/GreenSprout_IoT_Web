import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate } from 'react-router';

import HomePage from './pages/home/HomePage';
import AuthPage from './pages/auth/AuthPage';
import AuthEmail from './pages/auth/AuthEmail';

function App() {
  return (
    <Routes >
      <Route path='/' element={<Navigate to='/login'/>}/>
      <Route path="login" element={<AuthPage isLogin={true}/>}/>
      <Route path="register" element={<AuthPage isLogin={false}/>}/>
      <Route path="home" element={<HomePage/>}/>
      <Route path="register-email" element={<AuthEmail isTypeOTP={false}/>}/>
      <Route path="otp" element={<AuthEmail isTypeOTP={true}/>}/>


    </Routes>
  );
}

export default App;