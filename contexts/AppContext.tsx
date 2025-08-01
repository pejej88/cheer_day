import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppData, UserInfo, ActivityLog, CategoryStats, CategoryKey, ChallengeContent } from '../types';
import { CATEGORY_MAP } from '../constants';
import { useAuth } from './AuthContext';

const LOCAL_STORAGE_KEY = 'todayChallengeApp';

interface AppContextType {
    isInitialized: boolean;
    userInfo: UserInfo;
    activityLog: ActivityLog[];
    categoryStats: CategoryStats;
    setBirthDate: (birthDate: string) => void;
    completeChallenge: (categoryKey: CategoryKey, content: ChallengeContent) => void;
    getTodaysCompletion: () => ActivityLog | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getTodayDateString = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

const getStorageKey = (userId: string) => `${LOCAL_STORAGE_KEY}_${userId}`;

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [isInitialized, setIsInitialized] = useState(false);
    const [appData, setAppData] = useState<AppData>({
        userInfo: {},
        activityLog: [],
        categoryStats: {},
    });

    // 사용자별 데이터 로드
    useEffect(() => {
        if (user) {
            try {
                const userStorageKey = getStorageKey(user.id.toString());
                const storedData = localStorage.getItem(userStorageKey);
                if (storedData) {
                    const parsedData = JSON.parse(storedData) as AppData;
                    // Add a guard to prevent crashes from corrupted data
                    if (!Array.isArray(parsedData.activityLog)) {
                        parsedData.activityLog = [];
                    }
                    setAppData(parsedData);
                } else {
                    // 새 사용자일 경우 기본 데이터 설정
                    setAppData({
                        userInfo: {},
                        activityLog: [],
                        categoryStats: {},
                    });
                }
            } catch (error) {
                console.error("Failed to load data from localStorage", error);
            } finally {
                setIsInitialized(true);
            }
        } else {
            // 로그인하지 않은 경우 기본 상태
            setAppData({
                userInfo: {},
                activityLog: [],
                categoryStats: {},
            });
            setIsInitialized(true);
        }
    }, [user]);

    // 사용자별 데이터 저장
    useEffect(() => {
        if (isInitialized && user) {
            try {
                const userStorageKey = getStorageKey(user.id.toString());
                localStorage.setItem(userStorageKey, JSON.stringify(appData));
            } catch (error) {
                console.error("Failed to save data to localStorage", error);
            }
        }
    }, [appData, isInitialized, user]);

    const setBirthDate = useCallback((birthDate: string) => {
        setAppData(prev => ({
            ...prev,
            userInfo: { ...prev.userInfo, birthDate }
        }));
    }, []);

    const completeChallenge = useCallback((categoryKey: CategoryKey, content: ChallengeContent) => {
        const today = getTodayDateString();
        
        setAppData(prevData => {
            const newStats = { ...prevData.categoryStats };
            let newActivityLog = [...prevData.activityLog];
            const todayCompletionIndex = newActivityLog.findIndex(log => log.date === today);

            if (todayCompletionIndex !== -1) {
                const oldCategoryKey = newActivityLog[todayCompletionIndex].categoryKey;
                if (newStats[oldCategoryKey]) {
                    newStats[oldCategoryKey] = Math.max(0, (newStats[oldCategoryKey] ?? 0) - 1);
                }
            }
            
            newStats[categoryKey] = (newStats[categoryKey] ?? 0) + 1;

            const newLogEntry: ActivityLog = {
                date: today,
                categoryKey,
                categoryName: CATEGORY_MAP[categoryKey].name,
                content,
            };

            if (todayCompletionIndex !== -1) {
                newActivityLog[todayCompletionIndex] = newLogEntry;
            } else {
                newActivityLog.push(newLogEntry);
            }
            
            newActivityLog.sort((a, b) => b.date.localeCompare(a.date));

            return {
                ...prevData,
                activityLog: newActivityLog,
                categoryStats: newStats,
            };
        });
    }, []);
    
    const getTodaysCompletion = useCallback(() => {
        const today = getTodayDateString();
        return appData.activityLog.find(log => log.date === today);
    }, [appData.activityLog]);

    const value = {
        isInitialized,
        userInfo: appData.userInfo,
        activityLog: appData.activityLog,
        categoryStats: appData.categoryStats,
        setBirthDate,
        completeChallenge,
        getTodaysCompletion
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAAppContext must be used within a AppContextProvider');
    }
    return context;
};