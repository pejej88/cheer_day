import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const code = params.get("code");
    if (!code) {
      alert("인가 코드가 없습니다.");
      navigate("/");
      return;
    }

    // 카카오 토큰 요청
    fetch(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${import.meta.env.VITE_KAKAO_JS_KEY}&redirect_uri=${window.location.origin}/auth&code=${code}`,
      {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("kakao_token", data.access_token);
          navigate("/main");
        } else {
          alert("토큰 발급 실패");
          navigate("/");
        }
      });
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span>로그인 처리 중...</span>
    </div>
  );
};

export default Auth;