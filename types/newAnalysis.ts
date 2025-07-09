// 📋 타입 정의
export interface NewsAnalysisMetadata {
	original_url: string;
	extracted_title: string;
	extracted_author?: string;
	extracted_date?: string;
	ai_model: string;
	analyzed_at: string;
	processing_time_ms: number;
	processing_time_readable: string;
	content_length: number;
	version: string;
}

export interface ExtractedContent {
	title: string;
	content: string;
	author?: string;
	publish_date?: string;
}

export interface AnalysisResult {
	title_rewrite: any;
	summary: any;
	keywords: any;
	difficulty: any;
	expression: any;
	thinking_questions: any;
	//historical_connection: any;
	complementary_insight: any;
}

export interface NewsAnalysisResponse {
	metadata: NewsAnalysisMetadata;
	extracted_content: ExtractedContent;
	analysis: AnalysisResult;
	share_info: {
		share_id: string;
		share_url: string;
	};
}

export type SupportedAIModel = "gemini" | "gpt" | "claude";

export type NewsItem = {

	title: string;
	originallink: string;
	description: string;
};

export type ProcessedNews = {
	title: string;
	url: string;
	summary: string;
};