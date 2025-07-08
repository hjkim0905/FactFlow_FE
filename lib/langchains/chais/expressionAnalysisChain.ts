import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { BaseAnalysisChain } from "./baseAnalysisChain";

export class ExpressionAnalysisChain extends BaseAnalysisChain {
	protected buildChain(): RunnableSequence {
		const expressionPrompt = PromptTemplate.fromTemplate(`
            다음 뉴스 기사의 표현 방식을 분석해주세요.
            
            기사 내용: {content}
            
            JSON 형식으로 출력:
            {{
                "emotional_analysis": {{
                    "positive_ratio": 30,
                    "negative_ratio": 20, 
                    "neutral_ratio": 50
                }},
                "objectivity_score": 70,
                "sensationalism_score": 3,
                "bias_score": 2
            }}
        `);

		return RunnableSequence.from([
			expressionPrompt,
			this.model,
			this.outputParser,
		]);
	}

	protected parseResult(result: string): any {
		return this.parseJsonSafely(result, {
			emotional_analysis: {
				positive_ratio: 33,
				negative_ratio: 33,
				neutral_ratio: 34,
			},
			objectivity_score: 50,
			sensationalism_score: 5,
			bias_score: 5,
		});
	}
}
