import {
    SunIcon,
    BanknotesIcon,
    HeartIcon,
    QuestionMarkCircleIcon,
    LanguageIcon
} from '@heroicons/react/24/outline';
import { Category, CategoryKey } from './types';

export const CATEGORIES: Category[] = [
    {
        key: 'fortune',
        name: '오늘의 운세',
        description: '생년월일로 알아보는 오늘의 운세',
        icon: SunIcon,
    },
    {
        key: 'economics',
        name: '경제 상식',
        description: '부동산, ETF, 채권 등 필수 용어',
        icon: BanknotesIcon,
    },
    {
        key: 'health',
        name: '건강 (스트레칭)',
        description: '거북목, 라운드 숄더 교정 운동',
        icon: HeartIcon,
    },
    {
        key: 'quiz',
        name: '퀴즈형 학습',
        description: '상식, 역사, 과학 퀴즈',
        icon: QuestionMarkCircleIcon,
    },
    {
        key: 'conversation',
        name: '오늘의 회화',
        description: '여행에서 유용한 영어/일본어 회화',
        icon: LanguageIcon,
    },
];

export const CATEGORY_MAP: Record<CategoryKey, Category> = CATEGORIES.reduce((acc, category) => {
    acc[category.key] = category;
    return acc;
}, {} as Record<CategoryKey, Category>);