export interface NewsAnalysisResponse {
    metadata: {
        original_url: string;
        extracted_title: string;
        extracted_author: string;
        extracted_date: string;
        ai_model: string;
        analyzed_at: string;
        processing_time_ms: number;
        processing_time_readable: string;
        content_length: number;
        version: string;
    };
    extracted_content: {
        title: string;
        content: string;
        author: string;
        publishDate: string;
    };
    analysis: {
        title_rewrite: {
            original_title: string;
            rewritten_title: string;
            removed_expressions: string[];
            change_reason: string;
            category: string;
            authors: string;
        };
        summary: {
            one_sentence: string;
            three_sentences: string[];
            five_sentences: string[];
            five_sentences_explanations?: string[];
        };
        keywords: {
            high_importance: Keyword[];
            medium_importance: Keyword[];
            low_importance: Keyword[];
        };
        difficulty: {
            level: string;
            score: number;
            icon: string;
            reading_tips: string[];
        };
        expression: {
            emotional_analysis: {
                positive_ratio: number;
                negative_ratio: number;
                neutral_ratio: number;
            };
            objectivity_score: number;
            sensationalism_score: number;
            bias_score: number;
            'percentage of objective statement': number;
            'percentage of subjective statement': number;
            objective_words_used: string[];
            subjective_words_used: string[];
        };
        thinking_questions: {
            causal_questions?: string[];
            causal_explanations?: string[];
            prediction_questions?: string[];
            prediction_explanations?: string[];
            perspective_questions?: string[];
            perspective_explanations?: string[];
        };
        complementary_insight: {
            complementary_articles: ComplementaryArticle[];
            insight: string;
        };
    };
    share_info: {
        share_id: string;
        share_url: string;
    };
}

export interface Keyword {
    keyword: string;
    description: string;
    color: string;
}

export interface ComplementaryArticle {
    icon: string;
    title: string;
    why_useful: string;
    summary: string;
    source: string;
    publisher: string;
}

// 추가: AI 모델 타입
export type SupportedAIModel = 'gemini' | 'gpt' | 'claude';

// 추가: 뉴스 아이템 타입
export type NewsItem = {
    title: string;
    originallink: string;
    description: string;
};

// 추가: 처리된 뉴스 타입
export type ProcessedNews = {
    title: string;
    url: string;
    summary: string;
};

// 추가: 분석 결과 타입(필요시 확장)
export type AnalysisResult = NewsAnalysisResponse['analysis'];
