// API 키 설정 파일
// 이 파일은 GitHub Pages에서 API 키를 안전하게 관리하기 위해 사용됩니다.
// 실제 API 키는 이 파일에 직접 입력하지 마시고, 환경 변수나 다른 안전한 방법을 사용하세요.

// window.GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// 카카오 개발자 콘솔에서 가져온 설정
window.KAKAO_CONFIG = {
  CLIENT_ID: 'd1e72c968b6e8b460896927f9ef87753', // JavaScript 키
  REDIRECT_URI: 'https://pejej88.github.io/cheer_day/', // 프로덕션 환경 (카카오 개발자센터 설정과 일치)
  // REDIRECT_URI: 'http://localhost:5173/#/auth/kakao/callback', // 개발 환경
};

// 설정 로드 완료 확인
console.log('config.js 로드 완료:', window.KAKAO_CONFIG);