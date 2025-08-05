import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface KakaoUser {
  id: number;
  kakao_account?: {
    profile?: {
      nickname?: string;
    };
  };
}

const Main: React.FC = () => {
  const [user, setUser] = useState<KakaoUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("kakao_token");
    if (!token) {
      navigate("/");
      return;
    }
    window.Kakao.API.request({
      url: "/v2/user/me",
      success: function (res: KakaoUser) {
        setUser(res);
      },
      fail: function (err: any) {
        alert("사용자 정보 조회 실패");
        navigate("/");
      },
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("kakao_token");
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <header style={{
        width: "100%",
        padding: "1rem",
        background: "#fff",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "flex-end"
      }}>
        <button
          onClick={handleLogout}
          style={{
            fontSize: "1rem",
            padding: "0.5rem 1.2rem",
            background: "#eee",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          로그아웃
        </button>
      </header>
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>메인 페이지</h1>
        {user && (
          <div style={{ marginTop: "2rem" }}>
            <div>카카오 ID: {user.id}</div>
            <div>닉네임: {user.kakao_account?.profile?.nickname}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Main;