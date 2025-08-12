import React from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, UserCircleIcon, ArrowUturnLeftIcon, FireIcon } from '@heroicons/react/24/solid';
import { AppContextProvider, useAAppContext } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import ChallengePage from './pages/ChallengePage';
import MyPage from './pages/MyPage';
import LoginPage from './components/LoginPage';

const Header = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const isChallengePage = location.pathname.startsWith('/challenge');

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 h-16 flex items-center justify-between px-4">
            {isChallengePage && (
                <button onClick={() => window.history.back()} className="p-2">
                    <ArrowUturnLeftIcon className="w-6 h-6 text-gray-600"/>
                </button>
            )}
            
            <div className="flex items-center gap-2 flex-1 justify-center">
                <FireIcon className="w-8 h-8 text-indigo-500" />
                <h1 className="text-xl font-bold text-gray-800">오늘도 챌린지</h1>
            </div>

            {user && (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {user.profileImage && (
                            <img 
                                src={user.profileImage} 
                                alt="프로필" 
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                        <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="ml-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            )}
        </header>
    );
};

const BottomNav = () => {
    const navItems = [
        { path: '/', label: '홈', icon: HomeIcon },
        { path: '/mypage', label: '마이페이지', icon: UserCircleIcon }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-10 h-16">
            <div className="flex justify-around items-center h-full">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/'}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 text-sm ${isActive ? 'text-indigo-600' : 'text-gray-500'}`
                        }
                    >
                        <Icon className="w-6 h-6" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

const AppRoutes = () => {
    const { isInitialized } = useAAppContext();
    const { user, isLoading } = useAuth();

    if (!isInitialized || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // 로그인되지 않은 경우 로그인 페이지 표시
    if (!user) {
        return <LoginPage />;
    }

    // 로그인된 경우 기존 앱 라우트 표시
    return (
        <div className="min-h-screen bg-gray-50 pb-16 pt-16">
            <Header />
            <main className="p-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/challenge/:categoryKey" element={<ChallengePage />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Routes>
            </main>
            <BottomNav />
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
        <AppContextProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AppContextProvider>
    </AuthProvider>
  );
}

export default App;