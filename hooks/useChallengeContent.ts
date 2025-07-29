
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

        setIsLoading(true);
        setError(null);
        
        const cacheKey = `${CACHE_PREFIX}${date}_${categoryKey}`;

        try {
            // Check cache first
            const cachedContent = sessionStorage.getItem(cacheKey);
            if (cachedContent) {
                setContent(JSON.parse(cachedContent));
                setIsLoading(false);
                return;
            }

            // If not in cache, fetch from service
            const fetchedContent = await getChallengeContentForDate(categoryKey, date, userInfo);
            
            if (fetchedContent) {
                setContent(fetchedContent);
                sessionStorage.setItem(cacheKey, JSON.stringify(fetchedContent));
            } else {
                setError('챌린지 내용을 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error(err);
            setError('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [categoryKey, date, userInfo]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    return { content, isLoading, error, refetch: fetchContent };
};
