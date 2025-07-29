import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChallengeContent } from '../hooks/useChallengeContent';
import { useAAppContext } from '../contexts/AppContext';
import { CategoryKey, FortuneContent, EconomicsContent, HealthContent, QuizContent, ConversationContent } from '../types';
import { CATEGORY_MAP } from '../constants';

const getTodayDateString = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
    </div>
);

const ErrorDisplay: React.FC<{ message: string, onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{message}</p>
        <button onClick={onRetry} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
            다시 시도
        </button>
    </div>
);

const FortuneChallenge: React.FC<{ content: FortuneContent, onComplete: () => void }> = ({ content, onComplete }) => {
    const { userInfo, setBirthDate } = useAAppContext();
    const [inputBirthDate, setInputBirthDate] = useState(userInfo.birthDate || '');
    const [isSubmitted, setIsSubmitted] = useState(!!userInfo.birthDate);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (/^\d{8}$/.test(inputBirthDate)) {
            setBirthDate(inputBirthDate);
            setIsSubmitted(true);
        } else {
            alert('생년월일을 8자리 숫자로 입력해주세요. (예: 19900101)');
        }
    };

    if (!isSubmitted) {
        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-gray-700">오늘의 운세를 보려면 생년월일을 입력해주세요.</p>
                <input
                    type="text"
                    value={inputBirthDate}
                    onChange={(e) => setInputBirthDate(e.target.value)}
                    placeholder="YYYYMMDD (예: 19900101)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                    운세 보기
                </button>
            </form>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                <p className="text-gray-800 leading-relaxed">{content.text}</p>
            </div>
            <button onClick={onComplete} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-bold text-lg">
                완료
            </button>
        </div>
    );
};

const EconomicsChallenge: React.FC<{ content: EconomicsContent, onComplete: () => void }> = ({ content, onComplete }) => (
    <div className="space-y-6">
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-2xl font-bold text-green-800 mb-2">{content.term}</h3>
            <p className="text-gray-800 leading-relaxed">{content.description}</p>
        </div>
        <button onClick={onComplete} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-bold text-lg">
            완료
        </button>
    </div>
);

const HealthChallenge: React.FC<{ content: HealthContent, onComplete: () => void }> = ({ content, onComplete }) => (
    <div className="space-y-8">
        <h3 className="text-2xl font-bold text-center text-cyan-800">{content.title}</h3>
        <div className="space-y-6">
            {content.steps.map((step, index) => (
                <div key={index} className="bg-cyan-50 p-4 rounded-xl border border-cyan-200 flex flex-col md:flex-row items-center gap-4">
                    <img src={step.imageUrl} alt={`Step ${index + 1}`} className="w-48 h-48 rounded-lg object-cover shadow-sm"/>
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="font-bold text-lg text-cyan-700 mb-2">Step {index + 1}</h4>
                        <p className="text-gray-700">{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
        <button onClick={onComplete} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-bold text-lg">
            완료
        </button>
    </div>
);

const QuizChallenge: React.FC<{ content: QuizContent, onComplete: () => void }> = ({ content, onComplete }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        if (selectedOption) {
            setIsSubmitted(true);
        }
    };
    
    const getButtonClass = (option: string) => {
        if (!isSubmitted) return "bg-white hover:bg-gray-100 border-gray-300";
        if (option === content.answer) return "bg-green-500 text-white border-green-500";
        if (option === selectedOption) return "bg-red-500 text-white border-red-500";
        return "bg-white border-gray-300 opacity-70";
    };

    return (
        <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <p className="text-lg font-semibold text-purple-900">{content.question}</p>
            </div>
            <div className="space-y-3">
                {content.options.map(option => (
                    <button 
                        key={option}
                        onClick={() => !isSubmitted && setSelectedOption(option)}
                        className={`w-full p-4 rounded-lg border text-left transition ${getButtonClass(option)} ${selectedOption === option && !isSubmitted ? 'ring-2 ring-indigo-500' : ''}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {isSubmitted ? (
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold">해설</h4>
                    <p>{content.explanation}</p>
                     <button onClick={onComplete} className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-bold text-lg">
                        완료
                    </button>
                </div>
            ) : (
                <button onClick={handleSubmit} disabled={!selectedOption} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition font-bold text-lg">
                    정답 확인
                </button>
            )}
        </div>
    );
};

const ConversationChallenge: React.FC<{ content: ConversationContent, onComplete: () => void }> = ({ content, onComplete }) => (
    <div className="space-y-8">
        {/* English Section */}
        <div className="space-y-4">
             <h3 className="text-xl font-bold text-blue-800">영어 한 문장</h3>
             <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
                <p className="text-sm text-blue-600 mb-2">{content.english.context}</p>
                <p className="text-2xl font-bold text-blue-900">"{content.english.phrase}"</p>
                <p className="text-lg text-gray-600 mt-2">{content.english.translation}</p>
            </div>
        </div>

        {/* Japanese Section */}
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-red-800">일본어 한 문장</h3>
            <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">
                <p className="text-sm text-red-600 mb-2">{content.japanese.context}</p>
                <p className="text-2xl font-bold text-red-900">"{content.japanese.phrase}"</p>
                {content.japanese.pronunciation && (
                    <p className="text-md text-gray-500 mt-1">[{content.japanese.pronunciation}]</p>
                )}
                <p className="text-lg text-gray-600 mt-2">{content.japanese.translation}</p>
            </div>
        </div>

        <button onClick={onComplete} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-bold text-lg">
            완료
        </button>
    </div>
);

const ChallengePage = () => {
    const { categoryKey } = useParams<{ categoryKey: CategoryKey }>();
    const navigate = useNavigate();
    const { completeChallenge, userInfo, setBirthDate } = useAAppContext();
    const [today, setToday] = useState(getTodayDateString());

    useEffect(() => {
        const interval = setInterval(() => {
            const newToday = getTodayDateString();
            if (today !== newToday) {
                setToday(newToday);
            }
        }, 60000); // Check every minute to see if the day has changed

        return () => clearInterval(interval);
    }, [today]);

    useEffect(() => {
        // On unmount, if the challenge was fortune, reset the birth date
        return () => {
            if (categoryKey === 'fortune') {
                setBirthDate('');
            }
        };
    }, [categoryKey, setBirthDate]);
    
    const { content, isLoading, error, refetch } = useChallengeContent(categoryKey, today);
    
    const handleComplete = () => {
        if (categoryKey && content) {
            completeChallenge(categoryKey, content);
            navigate('/');
        }
    };
    
    const renderContent = () => {
        if (!categoryKey || !content) return null;
        
        switch (categoryKey) {
            case 'fortune':
                return <FortuneChallenge content={content as FortuneContent} onComplete={handleComplete} />;
            case 'economics':
                return <EconomicsChallenge content={content as EconomicsContent} onComplete={handleComplete} />;
            case 'health':
                return <HealthChallenge content={content as HealthContent} onComplete={handleComplete} />;
            case 'quiz':
                return <QuizChallenge content={content as QuizContent} onComplete={handleComplete} />;
            case 'conversation':
                return <ConversationChallenge content={content as ConversationContent} onComplete={handleComplete} />;
            default:
                return <p>알 수 없는 챌린지입니다.</p>;
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {categoryKey && CATEGORY_MAP[categoryKey].name}
            </h2>

            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} onRetry={refetch} />}
            
            {!isLoading && !error && (
                <>
                    {/* Render content if it's available */}
                    {content && renderContent()}
                    
                    {/* Special case: For 'fortune' category, if birth date is missing, show form to input it. */}
                    {categoryKey === 'fortune' && !userInfo.birthDate && (
                         <div className="space-y-4">
                            <FortuneChallenge content={{text: ""}} onComplete={() => {}}/>
                         </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ChallengePage;