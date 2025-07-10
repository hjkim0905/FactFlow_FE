import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { AIModelFactory } from "@/lib/langchains/config/aiModelConfig";
import {
	extractFromUrl,
	isValidUrl,
} from "@/lib/langchains/utils/contentExtractor";
import { TitleRewriteChain } from "@/lib/langchains/chais/titleRewriteChain";
import { SummaryChain } from "@/lib/langchains/chais/summaryChain";
import { KeywordExtractionChain } from "@/lib/langchains/chais/keywordExtractionChain";
import { DifficultyAnalysisChain } from "@/lib/langchains/chais/difficiltyAnalysisChain";
import { ExpressionAnalysisChain } from "@/lib/langchains/chais/expressionAnalysisChain";
import { ThinkingQuestionChain } from "@/lib/langchains/chais/thinkingQuestionChain";
//import { HistoricalConnectionChain } from "@/lib/langchains/chais/historicalConnectionChain";
//import { HistoricalNewsPipeline } from "@/lib/pipelines/HistoricalNewsPipeline"; //
import { ComplementaryInsightChain } from "@/lib/langchains/chais/complementaryInsightChain";
import type {
	SupportedAIModel,
	NewsAnalysisResponse,
	AnalysisResult,
	ProcessedNews,
} from "@/types/newAnalysis";

import { fetchSimilarNews } from "@/lib/langchains/utils/fetchSimilarNews";

export const ContentExtractor = {
	extractFromUrl,
	isValidUrl,
};

export class NewsAnalysisService {
	private model: BaseChatModel;
	private modelType: SupportedAIModel;
	private chains!: {
		title: TitleRewriteChain;
		summary: SummaryChain;
		keywords: KeywordExtractionChain;
		difficulty: DifficultyAnalysisChain;
		expression: ExpressionAnalysisChain;
		questions: ThinkingQuestionChain;
		//historical: HistoricalConnectionChain;
		complementary: ComplementaryInsightChain;
	};

	//private historicalPipeline: HistoricalNewsPipeline;

	constructor(modelType?: SupportedAIModel, apiKey?: string) {
		if (modelType && apiKey) {
			this.model = AIModelFactory.createModel({ model: modelType, apiKey });
			this.modelType = modelType;
		} else {
			this.model = AIModelFactory.createFromEnv();
			this.modelType = AIModelFactory.getActiveModel();
		}

		console.log(`🤖 ${this.modelType.toUpperCase()} AI 모델 초기화`);
		this.initializeChains();
		//this.historicalPipeline = new HistoricalNewsPipeline(this.model);
	}

	private initializeChains(): void {
		this.chains = {
			title: new TitleRewriteChain(this.model),
			summary: new SummaryChain(this.model),
			keywords: new KeywordExtractionChain(this.model),
			difficulty: new DifficultyAnalysisChain(this.model),
			expression: new ExpressionAnalysisChain(this.model),
			questions: new ThinkingQuestionChain(this.model),
			//historical: new HistoricalConnectionChain(this.model),
			complementary: new ComplementaryInsightChain(this.model),
		};
		console.log("✅ 모든 체인 초기화 완료");
	}

	async analyzeNewsFromUrl(newsUrl: string): Promise<NewsAnalysisResponse> {
		try {
			console.log(`🚀 뉴스 분석 시작: ${newsUrl}`);
			const startTime = Date.now();

			if (!isValidUrl(newsUrl)) {
				throw new Error("유효하지 않은 URL입니다");
			}

			// 웹페이지 내용 추출
			const extractedData = await extractFromUrl(newsUrl);

			// 모든 분석 실행
			const analysisResults = await this.runAllAnalyses(
				extractedData.content,
				extractedData.title,
			);

			const processingTime = Date.now() - startTime;

			return {
				metadata: {
					original_url: newsUrl,
					extracted_title: extractedData.title,
					extracted_author: extractedData.author,
					extracted_date: extractedData.publishDate,
					ai_model: this.modelType.toUpperCase(),
					analyzed_at: new Date().toISOString(),
					processing_time_ms: processingTime,
					processing_time_readable: this.formatTime(processingTime),
					content_length: extractedData.content.length,
					version: "2.0.0",
				},
				extracted_content: extractedData,
				analysis: analysisResults,
				share_info: {
					share_id: this.generateId(),
					share_url: `/share/${this.generateId()}`,
				},
			};
		} catch (error: unknown) {
			console.error("❌ 뉴스 분석 실패:", error);
			throw new Error(
				`뉴스 분석 실패: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	private async runAllAnalyses(
		content: string,
		title = "",
	): Promise<AnalysisResult> {
		const input = { content, title };
		const results: Partial<AnalysisResult> = {};
		console.log("input : ", input);
		console.log("📊 전체 분석 실행 중...");

		// 순차적으로 모든 분석 실행
		try {
			console.log("1/7 - 제목 재구성");
			results.title_rewrite = await this.executeWithRetry(() =>
				this.chains.title.invoke(input),
			);

			console.log("2/7 - 요약 생성");
			results.summary = await this.executeWithRetry(() =>
				this.chains.summary.invoke(input),
			);

			console.log("3/7 - 키워드 추출");
			results.keywords = await this.executeWithRetry(() =>
				this.chains.keywords.invoke(input),
			);

			console.log("4/7 - 난이도 분석");
			results.difficulty = await this.executeWithRetry(() =>
				this.chains.difficulty.invoke(input),
			);

			console.log("5/7 - 표현 분석");
			results.expression = await this.executeWithRetry(() =>
				this.chains.expression.invoke(input),
			);

			console.log("6/7 - 사고 질문 생성");
			results.thinking_questions = await this.executeWithRetry(() =>
				this.chains.questions.invoke(input),
			);

			// console.log("7/7 - 과거 연관 분석");
			// results.historical_connection = await this.executeWithRetry(() =>
			// 	this.chains.historical.invoke(input),
			// );

			// 3/7에서 추출된 키워드가 다음과 같이 있다고 가정
			// const extractedKeywords: string[] = results.keywords?.high_importance?.map(k => k.keyword) || [];
			//
			// results.historical_connection = await this.executeWithRetry(() =>
			// 	this.chains.historical.invoke({
			// 		...input,
			// 		keywords: extractedKeywords.join(", "), // prompt에 문자열로 넣기 쉽게 조합
			// 	})
			//);

			// ✅ Historical + Complementary 공통 input 준비
			// summary extraction
			let summary = "";
			if (
				results.summary &&
				typeof results.summary === "object" &&
				"text" in results.summary
			) {
				summary = (results.summary as { text: string }).text;
			} else {
				summary = input.content.slice(0, 300);
			}
			// keywords extraction
			let keywords: string[] = [];
			if (
				results.keywords &&
				typeof results.keywords === "object" &&
				"high_importance" in results.keywords
			) {
				const hi = (
					results.keywords as { high_importance: { keyword: string }[] }
				).high_importance;
				if (Array.isArray(hi)) {
					keywords = hi.map((k) => k.keyword);
				}
			}

			console.log("📂 관련 기사 검색");
			let similarArticles: ProcessedNews[] = [];
			try {
				similarArticles = await fetchSimilarNews(summary, keywords);
				console.log("📊 검색된 기사 수:", similarArticles.length);
			} catch (error) {
				console.warn("⚠️ 관련 기사 검색 실패, 빈 배열 사용:", error);
				similarArticles = [];
			}

			// console.log("7/8 - 과거 유사 사건 분석");
			// results.historical_connection = await this.historicalPipeline.run({
			// 	originalSummary: summary,
			// 	keywords,
			// 	similarArticles,
			// });

			console.log("7/7 - 배경/보완 기사 추천");
			console.log("📊 similarArticles 길이:", similarArticles.length);
			console.log("📊 keywords:", keywords);

			// 배포 환경에서 네이버 API 키가 없을 수 있으므로 더 안전하게 처리
			if (similarArticles.length > 0 && keywords.length > 0) {
				console.log("✅ 보완 분석 실행");
				try {
					results.complementary_insight = await this.executeWithRetry(() =>
						this.chains.complementary.run({
							articles: similarArticles,
							keywords,
						}),
					);
				} catch (error) {
					console.warn("⚠️ 보완 분석 실패, 기본값 사용:", error);
					results.complementary_insight = {
						complementary_articles: [],
						insight: "보완 분석을 제공할 수 없습니다.",
					};
				}
			} else {
				console.log(
					"⚠️ 관련 기사가 없거나 키워드가 없어 보완 분석을 건너뜁니다.",
				);
				results.complementary_insight = {
					complementary_articles: [],
					insight: "관련 기사를 찾을 수 없어 보완 분석을 제공할 수 없습니다.",
				};
			}
		} catch (error: unknown) {
			console.error("분석 중 오류:", error);
		}

		return results as AnalysisResult;
	}

	private async executeWithRetry<T>(
		operation: () => Promise<T>,
		maxRetries = 2,
	): Promise<T> {
		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				return await operation();
			} catch (error: unknown) {
				if (attempt === maxRetries) {
					console.warn(
						`최종 실패: ${error instanceof Error ? error.message : String(error)}`,
					);
					return {} as T; // 기본값 반환
				}
				console.warn(
					`재시도 ${attempt}/${maxRetries}: ${error instanceof Error ? error.message : String(error)}`,
				);
				await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
			}
		}
		return {} as T;
	}

	async runSingleAnalysis(
		type: string,
		content: string,
		title?: string,
	): Promise<unknown> {
		const input = { content, title: title || "" };

		switch (type) {
			case "title":
				return await this.chains.title.invoke(input);
			case "summary":
				return await this.chains.summary.invoke(input);
			case "keywords":
				return await this.chains.keywords.invoke(input);
			case "difficulty":
				return await this.chains.difficulty.invoke(input);
			case "expression":
				return await this.chains.expression.invoke(input);
			case "questions":
				return await this.chains.questions.invoke(input);
			//case "historical": return await this.chains.historical.invoke(input);
			default:
				throw new Error(`지원하지 않는 분석 유형: ${type}`);
		}
	}

	private formatTime(ms: number): string {
		if (ms < 1000) return `${ms}ms`;
		if (ms < 60000) return `${(ms / 1000).toFixed(1)}초`;
		return `${(ms / 60000).toFixed(1)}분`;
	}

	private generateId(): string {
		return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
	}

	getModelInfo() {
		return {
			model: this.modelType.toUpperCase(),
			type: this.modelType,
		};
	}
}
