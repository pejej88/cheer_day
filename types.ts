import React from 'react';

export type CategoryKey = 'fortune' | 'economics' | 'health' | 'quiz' | 'language';

export interface Category {
    key: CategoryKey;
    name: string;
    description: string;
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
}

export interface UserInfo {
    birthDate?: string;
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
}

export type ChallengeContent = FortuneContent | EconomicsContent | HealthContent | QuizContent | LanguageContent;

export interface AppData {
    userInfo: UserInfo;
    activityLog: ActivityLog[];
    categoryStats: CategoryStats;
}
