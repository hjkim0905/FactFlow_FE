import type { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

export abstract class BaseAnalysisChain {
	protected model: BaseChatModel;
	protected outputParser: StringOutputParser;
	protected chain: RunnableSequence;

	constructor(model: BaseChatModel) {
		this.model = model;
		this.outputParser = new StringOutputParser();
		this.chain = this.buildChain();
	}

	protected abstract buildChain(): RunnableSequence;
	protected abstract parseResult(result: string): unknown;

	async invoke(input: { content: string; title?: string }): Promise<unknown> {
		try {
			const result = await this.chain.invoke(input);
			return this.parseResult(result);
		} catch (error: unknown) {
			console.error(`${this.constructor.name} 실행 오류:`, error);
			throw error;
		}
	}

	protected parseJsonSafely(
		jsonString: string,
		fallback: unknown = {},
	): unknown {
		try {
			// 1. 코드 블록 제거
			const cleaned = jsonString
				.replace(/^```json\s*/i, "")
				.replace(/```$/, "")
				.trim();

			// 2. JSON 객체 찾기
			const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

			if (jsonMatch) {
				const jsonStr = jsonMatch[0];

				// 3. 문자열 내 쌍따옴표 이스케이프 처리
				const fixedJsonStr = this.fixJsonQuotes(jsonStr);

				// 4. JSON 파싱
				return JSON.parse(fixedJsonStr);
			}

			return fallback;
		} catch (error) {
			console.warn("JSON 파싱 실패:", error);
			console.warn("원본 문자열:", jsonString);
			return fallback;
		}
	}

	private fixJsonQuotes(jsonStr: string): string {
		try {
			// 모든 문자열 필드의 값 내부에 이스케이프되지 않은 쌍따옴표를 이스케이프 처리 (더 강력하게)
			// "필드명": "값" 패턴을 모두 탐색
			return jsonStr.replace(
				/("[\w_]+"\s*:\s*")((?:[^"\\]|\\.)*)(")/g,
				(match, prefix, content, suffix) => {
					// content 내부의 이스케이프되지 않은 쌍따옴표를 모두 이스케이프
					const escapedContent = content.replace(/(?<!\\)"/g, '\\"');
					return prefix + escapedContent + suffix;
				},
			);
		} catch (error) {
			console.warn("⚠️ fixJsonQuotes 실패:", error);
			return jsonStr;
		}
	}
}
