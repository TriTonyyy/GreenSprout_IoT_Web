import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate } from 'react-router';

import HomePage from './pages/home/HomePage';
import AuthPage from './pages/auth/AuthPage';

function App() {
  return (
    <Routes >
      <Route path='/' element={<Navigate to='/login'/>}/>
      <Route path="login" element={<AuthPage isLogin={true}/>}/>
      <Route path="register" element={<AuthPage isLogin={false}/>}/>

    </Routes>
  );
}

export default App;
