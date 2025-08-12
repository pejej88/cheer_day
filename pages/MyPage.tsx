import React, { useState } from 'react';
import { useAAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ActivityLog, CategoryKey, EconomicsContent, FortuneContent, HealthContent, LanguageContent, QuizContent, ConversationContent } from '../types';
import { CATEGORY_MAP } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/solid';

// Reusable Modal Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold">챌린지 다시보기</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

// Past Challenge Content Display
const PastChallengeContent: React.FC<{ activity: ActivityLog }> = ({ activity }) => {
    const { categoryKey, content } = activity;
    
    switch (categoryKey) {
        case 'fortune':
            return <p className="text-gray-700">{(content as FortuneContent).text}</p>;
        case 'economics':
            const eco = content as EconomicsContent;
            return <div className="space-y-2">
                <h4 className="font-bold text-xl">{eco.term}</h4>
                <p>{eco.description}</p>
            </div>;
        case 'health':
            const health = content as HealthContent;
            return <div className="space-y-4">
                <h4 className="font-bold text-xl text-center">{health.title}</h4>
                {health.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <img src={step.imageUrl || `https://picsum.photos/100`} alt={`Step ${i+1}`} className="w-24 h-24 rounded-md object-cover" />
                        <p>{step.description}</p>
                    </div>
                ))}
            </div>;
        case 'quiz':
            const quiz = content as QuizContent;
            return <div className="space-y-3">
                <p className="font-semibold">{quiz.question}</p>
                <p><span className="font-bold">정답:</span> {quiz.answer}</p>
                <p><span className="font-bold">해설:</span> {quiz.explanation}</p>
            </div>;
        case 'conversation':
            const convo = content as ConversationContent;
            return (
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-lg text-blue-700 mb-2">영어 회화</h4>
                        <div className="space-y-1 text-center bg-blue-50 p-3 rounded-md">
                            <p className="text-sm text-gray-500">{convo.english.context}</p>
                            <p className="font-semibold text-xl">"{convo.english.phrase}"</p>
                            <p>{convo.english.translation}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-red-700 mb-2">일본어 회화</h4>
                        <div className="space-y-1 text-center bg-red-50 p-3 rounded-md">
                            <p className="text-sm text-gray-500">{convo.japanese.context}</p>
                            <p className="font-semibold text-xl">"{convo.japanese.phrase}"</p>
                            {convo.japanese.pronunciation && (
                                <p className="text-sm text-gray-500">[{convo.japanese.pronunciation}]</p>
                            )}
                            <p>{convo.japanese.translation}</p>
                        </div>
                    </div>
                </div>
            );
        default:
            return <p>콘텐츠를 표시할 수 없습니다.</p>;
    }
};


const Calendar = ({ completedDates }: { completedDates: Set<string> }) => {
    const [date, setDate] = useState(new Date());

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = ["일", "월", "화", "수", "목", "금", "토"];

    const changeMonth = (amount: number) => {
        setDate(currentDate => {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5"/></button>
                <h3 className="text-lg font-bold">{year}년 {month + 1}월</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5"/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
                {days.map(day => <div key={day} className="font-semibold">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const dayNumber = day + 1;
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                    const isCompleted = completedDates.has(dateString);
                    return (
                        <div key={dayNumber} className="flex justify-center items-center h-10">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isCompleted ? 'bg-indigo-500 text-white' : 'text-gray-700'}`}>
                                {dayNumber}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CategoryStatsDisplay = ({ stats }: { stats: { [key in CategoryKey]?: number }}) => {
    const sortedStats = Object.entries(stats)
        .filter(([, count]) => count && count > 0)
        .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));

    if (sortedStats.length === 0) {
        return (
             <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-bold mb-2">카테고리 통계</h3>
                <p className="text-gray-500">아직 완료한 챌린지가 없어요!</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3">자주 수행한 카테고리</h3>
            <div className="space-y-2">
                {sortedStats.map(([key, count], index) => {
                     const category = CATEGORY_MAP[key as CategoryKey];
                     if (!category) return null;
                     return (
                         <div key={key} className="flex items-center justify-between text-gray-700">
                             <span>{index + 1}. {category.name}</span>
                             <span className="font-bold">{count}회</span>
                         </div>
                     )
                })}
            </div>
        </div>
    )
}

const MyPage: React.FC = () => {
    const { userInfo, activityLog, categoryStats } = useAAppContext();
    const { user } = useAuth();
    const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const sortedActivityLog = [...activityLog].sort((a, b) => b.date.localeCompare(a.date));
    const totalPages = Math.ceil(sortedActivityLog.length / itemsPerPage);
    const currentActivities = sortedActivityLog.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const completedDates = new Set(activityLog.map(log => log.date));

    return (
        <div className="space-y-6">
            {/* 사용자 정보 섹션 */}
            {user && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center space-x-4">
                        {user.profileImage ? (
                            <img 
                                src={user.profileImage} 
                                alt="프로필" 
                                className="w-16 h-16 rounded-full"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <UserCircleIcon className="w-10 h-10 text-gray-400" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="flex items-center mt-2 space-x-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                    {user.provider === 'kakao' ? '카카오' : '구글'} 로그인
                                </span>
                                <span className="text-sm text-gray-500">
                                    총 {activityLog.length}일 참여
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 기존 통계 및 활동 로그 코드 */}
            <Calendar completedDates={completedDates} />
            <CategoryStatsDisplay stats={categoryStats} />
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-3">성장 기록</h3>
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                    {currentActivities.length > 0 ? currentActivities.map((log, index) => (
                        <li key={`${log.date}-${index}`} 
                            onClick={() => setSelectedActivity(log)}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                        >
                            <span>{log.date}</span>
                            <span className="font-semibold text-indigo-700">{log.categoryName}</span>
                        </li>
                    )) : <p className="text-center text-gray-500 py-4">완료한 챌린지가 없습니다.</p>}
                </ul>
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-4 space-x-2">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="p-2 rounded-full hover:bg-gray-100">
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                            {currentPage} / {totalPages}
                        </span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 rounded-full hover:bg-gray-100">
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
            
            <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)}>
                {selectedActivity && <PastChallengeContent activity={selectedActivity} />}
            </Modal>
        </div>
    );
};

export default MyPage;