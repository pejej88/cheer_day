import React from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!window.Kakao) return alert("Kakao SDK 로드 실패");
    window.Kakao.Auth.authorize({
      redirectUri: window.location.origin + "/auth",
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f9fafb"
    }}>
      <button
        onClick={handleLogin}
        style={{
          fontSize: "1.5rem",
          padding: "1.2rem 3rem",
          background: "#fee500",
          border: "none",
          borderRadius: "12px",
          fontWeight: "bold",
          color: "#181600",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
        }}
      >
        카카오로 시작하기
      </button>
    </div>
  );
};

export default Login;