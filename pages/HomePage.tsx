import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAAppContext } from '../contexts/AppContext';
import { CATEGORIES, CATEGORY_MAP } from '../constants';
import { CategoryKey } from '../types';

const ChallengeCard: React.FC<{ categoryKey: CategoryKey, onClick: () => void }> = ({ categoryKey, onClick }) => {
    const category = CATEGORY_MAP[categoryKey];
    if (!category) return null;
    const Icon = category.icon;
    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform duration-200"
        >
            <div className="bg-indigo-100 rounded-full p-3 mb-4">
                <Icon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{category.description}</p>
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const { categoryStats } = useAAppContext();

    const handleChallengeSelect = (categoryKey: CategoryKey) => {
        navigate(`/challenge/${categoryKey}`);
    };

    const sortedStats = Object.entries(categoryStats)
        .sort(([, countA], [, countB]) => (countB ?? 0) - (countA ?? 0))
        .map(([key]) => key as CategoryKey);

    const frequentChallenges = sortedStats.slice(0, 2);
    const otherChallenges = CATEGORIES.map(c => c.key).filter(key => !frequentChallenges.includes(key));
    const orderedChallenges = [...frequentChallenges, ...otherChallenges];

    return (
        <div className="space-y-8">
            {frequentChallenges.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">자주 찾는 챌린지</h2>
                    <div className="grid grid-cols-2 gap-4">
                       {frequentChallenges.map(key => (
                           <button 
                                key={key}
                                onClick={() => handleChallengeSelect(key)}
                                className="bg-white p-4 rounded-lg shadow-sm text-indigo-700 font-semibold border border-indigo-200 hover:bg-indigo-50 transition"
                           >
                               {CATEGORY_MAP[key].name}
                           </button>
                       ))}
                    </div>
                </div>
            )}
            
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">오늘의 챌린지 선택하기</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {orderedChallenges.map(key => (
                        <ChallengeCard 
                            key={key} 
                            categoryKey={key}
                            onClick={() => handleChallengeSelect(key)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;