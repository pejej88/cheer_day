import React from 'react';

export type CategoryKey = 'fortune' | 'economics' | 'health' | 'quiz' | 'conversation';

export interface Category {
    key: CategoryKey;
    name: string;
    description: string;
    icon: (props: React.ComponentProps<'svg'>) => React.JSX.Element;
}

export interface UserInfo {
    birthDate?: string;
    id?: string;
    name?: string;
    email?: string;
    provider?: 'kakao' | 'google';
    profileImage?: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    provider: 'kakao' | 'google';
    profileImage?: string;
}

export interface ActivityLog {
    date: string; // YYYY-MM-DD
    categoryKey: CategoryKey;
    categoryName: string;
    content: ChallengeContent;
}

export type CategoryStats = {
    [key in CategoryKey]?: number;
};

// --- Challenge Content Types ---

export interface FortuneContent {
    text: string;
}

export interface EconomicsContent {
    term: string;
    description: string;
}

export interface HealthStep {
    description: string;
    imagePrompt: string;
    imageUrl?: string;
}
export interface HealthContent {
    title: string;
    steps: HealthStep[];
}

export interface QuizContent {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    type: 'multiple-choice' | 'short-answer';
}

export interface LanguageContent {
    phrase: string;
    translation: string;
    context: string;
    pronunciation?: string;
}

export interface ConversationContent {
    english: LanguageContent;
    japanese: LanguageContent;
}

export type ChallengeContent = FortuneContent | EconomicsContent | HealthContent | QuizContent | ConversationContent;

export interface AppData {
    userInfo: UserInfo;
    activityLog: ActivityLog[];
    categoryStats: CategoryStats;
}