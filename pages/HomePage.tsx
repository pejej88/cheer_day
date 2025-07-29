import React from 'react';
import { useNavigate } from 'react-router-dom';
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

    const handleChallengeSelect = (categoryKey: CategoryKey) => {
        navigate(`/challenge/${categoryKey}`);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">오늘의 챌린지 선택하기</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {CATEGORIES.map(category => (
                        <ChallengeCard 
                            key={category.key} 
                            categoryKey={category.key}
                            onClick={() => handleChallengeSelect(category.key)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;