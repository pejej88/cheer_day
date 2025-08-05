import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./components/Login";
import Auth from "./components/Auth";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";

const RequireAuth: React.FC = () => {
  const token = localStorage.getItem("kakao_token");
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth" element={<Auth />} />
        {/* 로그인 후에만 접근 가능한 라우트 */}
        <Route element={<RequireAuth />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;