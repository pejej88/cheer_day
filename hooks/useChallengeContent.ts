
import { useState, useEffect, useCallback } from 'react';
import { CategoryKey, ChallengeContent } from '../types';
import { getChallengeContentForDate } from '../services/geminiService';
import { useAAppContext } from '../contexts/AppContext';

const CACHE_PREFIX = 'challengeCache_';

export const useChallengeContent = (categoryKey: CategoryKey | null, date: string) => {
    const [content, setContent] = useState<ChallengeContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { userInfo } = useAAppContext();

    const fetchContent = useCallback(async () => {
        if (!categoryKey) return;
        
        // Don't fetch fortune content if birth date is not available.
        // The UI will handle prompting the user for it.
        if (categoryKey === 'fortune' && !userInfo.birthDate) {
            setContent(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        // 운세의 경우 생년월일이 변경되면 기존 캐시 무효화
        if (categoryKey === 'fortune' && userInfo.birthDate) {
            const oldCacheKey = `${CACHE_PREFIX}${date}_${categoryKey}`;
            sessionStorage.removeItem(oldCacheKey);
        }

        setIsLoading(true);
        setError(null);
        
        // 운세의 경우 생년월일을 포함한 캐시 키 생성
        const cacheKey = categoryKey === 'fortune' 
            ? `${CACHE_PREFIX}${date}_${categoryKey}_${userInfo.birthDate || 'no_birthdate'}`
            : `${CACHE_PREFIX}${date}_${categoryKey}`;

        try {
            // Check cache first
            const cachedContent = sessionStorage.getItem(cacheKey);
            if (cachedContent) {
                setContent(JSON.parse(cachedContent));
                setIsLoading(false);
                return;
            }

            // If not in cache, fetch from service
            console.log('Fetching content for:', { categoryKey, date, birthDate: userInfo.birthDate });
            const fetchedContent = await getChallengeContentForDate(categoryKey, date, userInfo);
            
            if (fetchedContent) {
                console.log('Content fetched successfully:', fetchedContent);
                setContent(fetchedContent);
                sessionStorage.setItem(cacheKey, JSON.stringify(fetchedContent));
            } else {
                console.error('Failed to fetch content for:', { categoryKey, date, birthDate: userInfo.birthDate });
                setError('챌린지 내용을 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error(err);
            // API 키가 없는 경우 더 구체적인 에러 메시지 제공
            if (err instanceof Error && err.message.includes('API key')) {
                setError('API 키가 설정되지 않았습니다. 관리자에게 문의해주세요.');
            } else {
                setError('챌린지 내용을 불러오는데 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [categoryKey, date, userInfo]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    return { content, isLoading, error, refetch: fetchContent };
};
