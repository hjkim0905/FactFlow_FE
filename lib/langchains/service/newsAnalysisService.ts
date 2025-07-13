import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { AIModelFactory } from "@/lib/langchains/config/aiModelConfig";
import {
	extractFromUrl,
	isValidUrl,
} from "@/lib/langchains/utils/contentExtractor";
import { TitleRewriteChain } from "@/lib/langchains/chains/titleRewriteChain";
import { SummaryChain } from "@/lib/langchains/chains/summaryChain";
import { KeywordExtractionChain } from "@/lib/langchains/chains/keywordExtractionChain";
import { DifficultyAnalysisChain } from "@/lib/langchains/chains/difficiltyAnalysisChain";
import { ExpressionAnalysisChain } from "@/lib/langchains/chains/expressionAnalysisChain";
import { ThinkingQuestionChain } from "@/lib/langchains/chains/thinkingQuestionChain";
//import { HistoricalConnectionChain } from "@/lib/langchains/chais/historicalConnectionChain";
//import { HistoricalNewsPipeline } from "@/lib/pipelines/HistoricalNewsPipeline"; //
import { ComplementaryInsightChain } from "../chains/complementaryInsightChain";
import type {
	SupportedAIModel,
	NewsAnalysisResponse,
	AnalysisResult,
	ProcessedNews,
} from "@/types/newsAnalysisResponse";

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
					extracted_author: extractedData.author ?? "",
					extracted_date: extractedData.publishDate ?? "",
					ai_model: this.modelType.toUpperCase(),
					analyzed_at: new Date().toISOString(),
					processing_time_ms: processingTime,
					processing_time_readable: this.formatTime(processingTime),
					content_length: extractedData.content.length,
					version: "2.0.0",
				},
				extracted_content:
					extractedData as NewsAnalysisResponse["extracted_content"],
				analysis: analysisResults as NewsAnalysisResponse["analysis"],
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
		//const results: Partial<AnalysisResult> = {}; // ✅ 변수 선언 추가
		const results: Record<string, unknown> = {};
		console.log("📊 전체 분석 병렬 실행 중...");

		// 기본 분석들을 먼저 병렬로 실행
		const basicAnalyses = [
			"title_rewrite",
			"summary",
			"keywords",
			"difficulty",
			"expression",
			"thinking_questions",
		] as const;

		const basicTasks = basicAnalyses.map(async (analysisType) => {
			try {
				let result;
				switch (analysisType) {
					case "title_rewrite":
						result = await this.executeWithRetry(() =>
							this.chains.title.invoke(input),
						);
						break;
					case "summary":
						result = await this.executeWithRetry(() =>
							this.chains.summary.invoke(input),
						);
						break;
					case "keywords":
						result = await this.executeWithRetry(() =>
							this.chains.keywords.invoke(input),
						);
						break;
					case "difficulty":
						result = await this.executeWithRetry(() =>
							this.chains.difficulty.invoke(input),
						);
						break;
					case "expression":
						result = await this.executeWithRetry(() =>
							this.chains.expression.invoke(input),
						);
						break;
					case "thinking_questions":
						result = await this.executeWithRetry(() =>
							this.chains.questions.invoke(input),
						);
						break;
				}

				results[analysisType] = result;
				console.log(`✅ ${analysisType} 완료`);
			} catch (error) {
				console.warn(`❌ ${analysisType} 분석 실패:`, error);
				results[analysisType] = this.getDefaultValue(analysisType);
			}
		});

		// 기본 분석들 완료 대기
		await Promise.all(basicTasks);

		// 🔍 요약/키워드 후속 처리 (기본 분석 결과 필요)
		let summary = input.content.slice(0, 300); // 기본값
		if (
			results.summary &&
			typeof results.summary === "object" &&
			"text" in results.summary
		) {
			summary = (results.summary as { text: string }).text;
		}

		let keywords: string[] = [];
		if (
			results.keywords &&
			typeof results.keywords === "object" &&
			"high_importance" in results.keywords
		) {
			keywords = (
				results.keywords as { high_importance: { keyword: string }[] }
			).high_importance.map((k) => k.keyword);
		}

		// 관련 기사 검색
		let similarArticles: ProcessedNews[] = [];
		try {
			similarArticles = await fetchSimilarNews(summary, keywords);
			console.log("📊 관련 기사 수:", similarArticles.length);
		} catch (error) {
			console.warn("⚠️ 관련 기사 검색 실패:", error);
			similarArticles = [];
		}

		// ✅ 보완 인사이트 (의존성 있는 분석)
		try {
			if (similarArticles.length > 0 && keywords.length > 0) {
				results.complementary_insight = (await this.executeWithRetry(() =>
					this.chains.complementary.run({
						articles: similarArticles,
						keywords,
					}),
				)) as NewsAnalysisResponse["analysis"]["complementary_insight"];
			} else {
				results.complementary_insight = {
					complementary_articles: [],
					insight: "관련 기사를 찾을 수 없어 보완 분석을 제공할 수 없습니다.",
				};
			}
		} catch (error) {
			console.warn("⚠️ 보완 인사이트 실패:", error);
			results.complementary_insight = {
				complementary_articles: [],
				insight: "보완 분석을 제공할 수 없습니다.",
			};
		}

		return results as AnalysisResult;
	}

	// 헬퍼 메서드 추가
	private getDefaultValue(analysisType: string): unknown {
		const defaults: Record<string, unknown> = {
			title_rewrite: { title: "제목 분석 실패" },
			summary: { text: "요약 실패" },
			keywords: { high_importance: [] },
			difficulty: { level: "unknown", reason: "분석 실패" },
			expression: { expressions: [] },
			thinking_questions: { questions: [] },
		};

		return defaults[analysisType] || {};
	}

	private async executeWithRetry<T>(
		operation: () => Promise<T>,
		maxRetries = 3,
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
