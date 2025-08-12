import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthUser } from '../types';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    const handleGoogleLogin = (response: { credential: string }) => {
        try {
            // JWT 토큰 디코딩 (간단한 방법)
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            const user: AuthUser = {
                id: payload.sub,
                name: payload.name || '구글 사용자',
                email: payload.email || '',
                provider: 'google',
                profileImage: payload.picture,
            };
            
            login(user);
        } catch (error) {
            console.error('구글 로그인 처리 실패:', error);
            alert('구글 로그인 처리에 실패했습니다.');
        }
    };

    useEffect(() => {
        // 카카오 SDK 초기화
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
        }

        // 구글 SDK 초기화
        const initializeGoogle = () => {
            if (window.google && window.google.accounts && googleButtonRef.current) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                        callback: handleGoogleLogin,
                        auto_select: false,
                        cancel_on_tap_outside: false,
                    });

                    window.google.accounts.id.renderButton(googleButtonRef.current, {
                        theme: 'outline',
                        size: 'large',
                        text: 'signin_with',
                        shape: 'rectangular',
                        width: '280px',
                    });
                    
                    console.log('구글 로그인 버튼이 렌더링되었습니다.');
                } catch (error) {
                    console.error('구글 SDK 초기화 실패:', error);
                }
            } else {
                console.log('구글 SDK가 아직 로드되지 않았습니다. 재시도합니다.');
                setTimeout(initializeGoogle, 100);
            }
        };

        // 페이지 로드 후 약간의 지연을 두고 초기화
        setTimeout(initializeGoogle, 500);
    }, []);

    const handleKakaoLogin = () => {
        if (!window.Kakao) {
            alert('카카오 SDK가 로드되지 않았습니다.');
            return;
        }

        window.Kakao.Auth.login({
            success: (authObj) => {
                // 사용자 정보 요청
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: (res: any) => {
                        const user: AuthUser = {
                            id: res.id.toString(),
                            name: res.kakao_account?.profile?.nickname || '카카오 사용자',
                            email: res.kakao_account?.email || `kakao_${res.id}@kakao.user`, // 이메일이 없는 경우 임시 이메일 생성
                            provider: 'kakao',
                            profileImage: res.kakao_account?.profile?.profile_image_url,
                        };
                        login(user);
                    },
                    fail: (err: any) => {
                        console.error('카카오 사용자 정보 요청 실패:', err);
                        alert('사용자 정보를 가져오는데 실패했습니다.');
                    },
                });
            },
            fail: (err: any) => {
                console.error('카카오 로그인 실패:', err);
                alert('카카오 로그인에 실패했습니다.');
            },
            // account_email 제거하고 기본 허용 항목들만 요청
            scope: 'profile_nickname,profile_image',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">오늘도 챌린지</h1>
                    <p className="text-gray-600">간편하게 로그인하고 시작하세요</p>
                </div>

                <div className="space-y-4">
                    {/* 카카오 로그인 버튼 */}
                    <button
                        onClick={handleKakaoLogin}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
                        </svg>
                        <span>카카오로 로그인</span>
                    </button>

                    {/* 구분선 */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">또는</span>
                        </div>
                    </div>

                    {/* 구글 로그인 버튼 */}
                    <div className="w-full flex justify-center">
                        <div ref={googleButtonRef} className="w-full"></div>
                    </div>
                    
                    {/* 구글 로그인 버튼이 로드되지 않을 경우를 위한 대체 버튼 */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500">구글 로그인 버튼이 표시되지 않으면 페이지를 새로고침해주세요.</p>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>로그인하면 서비스 이용약관 및</p>
                    <p>개인정보처리방침에 동의하는 것으로 간주됩니다.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 