import { GoogleGenAI, Type } from "@google/genai";
import { 
    CategoryKey, 
    FortuneContent, 
    EconomicsContent, 
    HealthContent, 
    QuizContent, 
    LanguageContent, 
    ChallengeContent,
    ConversationContent
} from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getTodayDateString = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

const generateJsonContent = async <T,>(prompt: string, responseSchema: any): Promise<T | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error("Error generating JSON content:", error);
        return null;
    }
};


const getFortune = async (birthDate: string, date: string): Promise<FortuneContent | null> => {
    const prompt = `${date} 기준, 생년월일이 ${birthDate}인 사람의 오늘의 총운과 금전운을 합해서 150자 내외로 재미있고 긍정적으로 설명해주세요.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return { text: response.text };
    } catch (error) {
        console.error('Error fetching fortune:', error);
        return null;
    }
};

const getEconomicTerm = async (date: string): Promise<EconomicsContent | null> => {
    const prompt = `오늘은 ${date} 입니다. 오늘 날짜에 해당하는 최신 경제 금융 용어(예: 부동산, ETF, 채권 관련) 하나를 선정하고, 일반인도 쉽게 이해할 수 있도록 200자 내외로 설명해주세요.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            term: { type: Type.STRING, description: "경제 용어" },
            description: { type: Type.STRING, description: "용어에 대한 쉬운 설명" },
        },
        required: ["term", "description"],
    };
    return generateJsonContent<EconomicsContent>(prompt, schema);
};

const getHealthExercise = async (date: string): Promise<HealthContent | null> => {
    const prompt = `오늘은 ${date} 입니다. 오늘 날짜에 해당하는, 현대인을 위한 간단한 스트레칭이나 운동(예: 거북목, 라운드숄더 교정) 하나를 선정해주세요. 운동 이름과, 운동 방법을 3단계로 나누어 설명해주세요. 각 단계는 50자 내외의 간단한 설명과, 해당 동작을 잘 보여주는 상세한 이미지 생성용 영문 프롬프트(imagePrompt)를 포함해야 합니다. imagePrompt는 "A minimalist line art drawing of a person doing [action], simple background, instructional style" 형식이어야 합니다.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "운동 이름" },
            steps: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING, description: "단계별 운동 설명" },
                        imagePrompt: { type: Type.STRING, description: "이미지 생성을 위한 영문 프롬프트" },
                    },
                    required: ["description", "imagePrompt"],
                },
            },
        },
        required: ["title", "steps"],
    };
    
    const content = await generateJsonContent<HealthContent>(prompt, schema);
    if (!content) return null;

    for (const step of content.steps) {
        try {
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: step.imagePrompt,
                config: { numberOfImages: 1, aspectRatio: '1:1', outputMimeType: 'image/jpeg' },
            });
            if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
                const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
                step.imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            }
        } catch (error) {
            console.error(`Error generating image for step: ${step.description}`, error);
            step.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(step.imagePrompt)}/512/512`;
        }
    }
    return content;
};


const getQuiz = async (date: string): Promise<QuizContent | null> => {
    const prompt = `오늘은 ${date} 입니다. 오늘 날짜에 해당하는 상식, 역사, 과학 분야의 재미있는 객관식 퀴즈를 하나 만들어주세요. 질문, 4개의 보기(options), 정답(answer), 그리고 100자 내외의 간단한 해설(explanation)을 포함해야 합니다.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING, description: "퀴즈 질문" },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4개의 보기" },
            answer: { type: Type.STRING, description: "정답" },
            explanation: { type: Type.STRING, description: "정답에 대한 해설" },
            type: { type: Type.STRING, enum: ["multiple-choice"], description: "퀴즈 타입" },
        },
        required: ["question", "options", "answer", "explanation", "type"],
    };
    return generateJsonContent<QuizContent>(prompt, schema);
};


const getLanguagePhrase = async (date: string, language: '영어' | '일본어'): Promise<LanguageContent | null> => {
    const isJapanese = language === '일본어';
    
    const prompt = isJapanese
        ? `오늘은 ${date} 입니다. 오늘 날짜에 해당하는, 여행 상황(공항, 식당, 쇼핑 등)에서 유용하게 사용할 수 있는 핵심 일본어 회화 표현을 하나 선정해주세요. 일본어 문장(phrase), 한국어 번역(translation), 이 표현의 일본어 발음을 한국어(pronunciation)로 표기하고, 어떤 상황에서 사용할 수 있는지 50자 내외의 간단한 설명(context)을 포함해주세요.`
        : `오늘은 ${date} 입니다. 오늘 날짜에 해당하는, 여행 상황(공항, 식당, 쇼핑 등)에서 유용하게 사용할 수 있는 핵심 영어 회화 표현을 하나 선정해주세요. 영어 문장(phrase), 한국어 번역(translation), 그리고 어떤 상황에서 사용할 수 있는지 50자 내외의 간단한 설명(context)을 포함해주세요.`;
    
    const schemaProperties: any = {
        phrase: { type: Type.STRING, description: `${language} 회화 문장` },
        translation: { type: Type.STRING, description: "한국어 번역" },
        context: { type: Type.STRING, description: "사용 상황 설명" },
    };
    const requiredFields = ["phrase", "translation", "context"];

    if (isJapanese) {
        schemaProperties.pronunciation = { type: Type.STRING, description: "일본어 문장의 한국어 발음 표기" };
        requiredFields.push("pronunciation");
    }

    const schema = {
        type: Type.OBJECT,
        properties: schemaProperties,
        required: requiredFields,
    };

    return generateJsonContent<LanguageContent>(prompt, schema);
};

const getConversation = async (date: string): Promise<ConversationContent | null> => {
    try {
        const [english, japanese] = await Promise.all([
            getLanguagePhrase(date, '영어'),
            getLanguagePhrase(date, '일본어')
        ]);

        if (english && japanese) {
            return { english, japanese };
        }
        return null;
    } catch (error) {
        console.error("Error fetching conversation content:", error);
        return null;
    }
};


const contentFetchers: { [K in CategoryKey]: (date: string, userInfo?: any) => Promise<ChallengeContent | null> } = {
    fortune: (date, userInfo) => getFortune(userInfo.birthDate, date),
    economics: (date) => getEconomicTerm(date),
    health: (date) => getHealthExercise(date),
    quiz: (date) => getQuiz(date),
    conversation: (date) => getConversation(date),
};

// Main function to get content for a category on a specific date
export const getChallengeContentForDate = async (
    categoryKey: CategoryKey,
    date: string,
    userInfo: { birthDate?: string }
): Promise<ChallengeContent | null> => {
    const fetcher = contentFetchers[categoryKey];
    if (fetcher) {
        if (categoryKey === 'fortune' && !userInfo.birthDate) {
            console.error("Birth date is required for fortune challenge.");
            return Promise.resolve(null);
        }
        return fetcher(date, userInfo);
    }
    return Promise.resolve(null);
};