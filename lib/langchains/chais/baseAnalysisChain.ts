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
	protected abstract parseResult(result: string): any;

	async invoke(input: { content: string; title?: string }): Promise<any> {
		try {
			const result = await this.chain.invoke(input);
			return this.parseResult(result);
		} catch (error: any) {
			console.error(`${this.constructor.name} 실행 오류:`, error);
			throw error;
		}
	}

	protected parseJsonSafely(jsonString: string, fallback: any = {}): any {
		try {
			const jsonMatch =
				jsonString.match(/```json\n([\s\S]*?)\n```/) ||
				jsonString.match(/\{[\s\S]*\}/);

			if (jsonMatch) {
				return JSON.parse(jsonMatch[1] || jsonMatch[0]);
			}

			return fallback;
		} catch (error) {
			console.warn("JSON 파싱 실패:", error);
			return fallback;
		}
	}
}
