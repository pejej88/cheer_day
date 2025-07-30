import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { kakaoAuthService, KakaoUser } from '../services/kakaoAuthService';

interface AuthContextType {
  user: KakaoUser | null;
  accessToken: string | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  handleKakaoCallback: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<KakaoUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 저장된 토큰 확인
  useEffect(() => {
    const savedToken = localStorage.getItem('kakao_access_token');
    const savedUser = localStorage.getItem('kakao_user');
    
    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const login = () => {
    const loginUrl = kakaoAuthService.getKakaoLoginUrl();
    if (loginUrl) {
      window.location.href = loginUrl;
    } else {
      console.error('카카오 로그인 URL을 생성할 수 없습니다.');
    }
  };

  const logout = async () => {
    if (accessToken) {
      try {
        await kakaoAuthService.logout(accessToken);
      } catch (error) {
        console.error('로그아웃 중 오류:', error);
      }
    }
    
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('kakao_access_token');
    localStorage.removeItem('kakao_user');
  };

  const handleKakaoCallback = async (code: string) => {
    try {
      setLoading(true);
      
      // 액세스 토큰 받기
      const token = await kakaoAuthService.getAccessToken(code);
      setAccessToken(token);
      
      // 사용자 정보 받기
      const userInfo = await kakaoAuthService.getUserInfo(token);
      setUser(userInfo);
      
      // 로컬 스토리지에 저장
      localStorage.setItem('kakao_access_token', token);
      localStorage.setItem('kakao_user', JSON.stringify(userInfo));
      
    } catch (error) {
      console.error('카카오 로그인 처리 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    login,
    logout,
    handleKakaoCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 