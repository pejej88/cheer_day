# 오늘도 챌린지

매일 새로운 챌린지를 제공하는 웹 애플리케이션입니다.

## 로컬 실행

**필수 조건:** Node.js

1. 의존성 설치:
   ```bash
   npm install
   ```

2. 환경 변수 설정:
   - `.env.local` 파일을 생성하고 `GEMINI_API_KEY`를 설정하세요
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```

## GitHub Pages 배포

### 자동 배포 (권장)

1. GitHub 저장소의 Settings > Secrets and variables > Actions에서 `GEMINI_API_KEY` 시크릿을 추가하세요
2. main 브랜치에 푸시하면 자동으로 배포됩니다

### 수동 배포

1. 환경 변수 설정:
   ```bash
   export GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. 빌드 및 배포:
   ```bash
   npm run build
   npm run deploy
   ```

## 문제 해결

### "챌린지 내용을 불러오는데 실패했습니다" 오류

이 오류는 주로 API 키가 설정되지 않았을 때 발생합니다:

1. **로컬 환경**: `.env.local` 파일에 `GEMINI_API_KEY`가 올바르게 설정되어 있는지 확인
2. **GitHub Pages**: GitHub 저장소의 Secrets에 `GEMINI_API_KEY`가 설정되어 있는지 확인
3. **브라우저 콘솔**: 개발자 도구에서 API 키 관련 오류 메시지 확인
