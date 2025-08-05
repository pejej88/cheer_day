import React from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, UserCircleIcon, ArrowUturnLeftIcon, FireIcon } from '@heroicons/react/24/solid';
import { AppContextProvider, useAAppContext } from './contexts/AppContext';
import HomePage from './pages/HomePage';
import ChallengePage from './pages/ChallengePage';
import MyPage from './pages/MyPage';

const Header = () => {
    const location = useLocation();
    const isChallengePage = location.pathname.startsWith('/challenge');

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 h-16 flex items-center justify-center px-4">
            {isChallengePage && (
                <button onClick={() => window.history.back()} className="absolute left-4 p-2">
                    <ArrowUturnLeftIcon className="w-6 h-6 text-gray-600"/>
                </button>
            )}
            <div className="flex items-center gap-2">
                <FireIcon className="w-8 h-8 text-indigo-500" />
                <h1 className="text-xl font-bold text-gray-800">오늘도 챌린지</h1>
            </div>
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
    if (!isInitialized) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/challenge/:categoryKey" element={<ChallengePage />} />
            <Route path="/mypage" element={<MyPage />} />
        </Routes>
    );
};

function App() {
  return (
    <AppContextProvider>
        <HashRouter>
            <div className="min-h-screen bg-gray-50 pb-16 pt-16">
                <Header />
                <main className="p-4">
                   <AppRoutes />
                </main>
                <BottomNav />
            </div>
        </HashRouter>
    </AppContextProvider>
  );
}

export default App;