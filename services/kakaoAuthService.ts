import axios from 'axios';

// 카카오 개발자 콘솔에서 가져온 설정
const getKakaoConfig = () => {
  // 환경 변수에서 먼저 시도
  if (process.env.KAKAO_CLIENT_ID) {
    return {
      CLIENT_ID: process.env.KAKAO_CLIENT_ID,
      REDIRECT_URI: process.env.KAKAO_REDIRECT_URI || 'http://localhost:5173/#/auth/kakao/callback'
    };
  }
  
  // GitHub Pages에서는 window 객체에 저장된 키를 사용
  if (typeof window !== 'undefined' && (window as any).KAKAO_CONFIG) {
    return (window as any).KAKAO_CONFIG;
  }
  
  console.error("KAKAO_CLIENT_ID is not set in environment variables or window object.");
  return null;
};

const config = getKakaoConfig();
const KAKAO_CLIENT_ID = config?.CLIENT_ID;
const KAKAO_REDIRECT_URI = config?.REDIRECT_URI;

export interface KakaoUser {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account: {
    profile_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
    };
    email_needs_agreement: boolean;
    email?: string;
    age_range_needs_agreement: boolean;
    age_range?: string;
    birthday_needs_agreement: boolean;
    birthday?: string;
    gender_needs_agreement: boolean;
    gender?: string;
  };
}

export const kakaoAuthService = {
  // 카카오 로그인 URL 생성
  getKakaoLoginUrl: () => {
    if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT_URI) {
      console.error('카카오 설정이 없습니다.');
      return '';
    }
    
    const params = new URLSearchParams({
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      response_type: 'code',
    });
    
    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  },

  // 인가 코드로 액세스 토큰 받기
  getAccessToken: async (code: string): Promise<string> => {
    if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT_URI) {
      throw new Error('카카오 설정이 없습니다.');
    }
    
    try {
      const response = await axios.post('https://kauth.kakao.com/oauth/token', {
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data.access_token;
    } catch (error) {
      console.error('카카오 액세스 토큰 받기 실패:', error);
      throw error;
    }
  },

  // 액세스 토큰으로 사용자 정보 받기
  getUserInfo: async (accessToken: string): Promise<KakaoUser> => {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('카카오 사용자 정보 받기 실패:', error);
      throw error;
    }
  },

  // 로그아웃
  logout: async (accessToken: string): Promise<void> => {
    try {
      await axios.post('https://kapi.kakao.com/v1/user/logout', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('카카오 로그아웃 실패:', error);
      throw error;
    }
  },
}; 