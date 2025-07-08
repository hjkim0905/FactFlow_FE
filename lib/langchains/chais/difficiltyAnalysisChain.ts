import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { BaseAnalysisChain } from "./baseAnalysisChain";

export class DifficultyAnalysisChain extends BaseAnalysisChain {
	protected buildChain(): RunnableSequence {
		const difficultyPrompt = PromptTemplate.fromTemplate(`
            다음 뉴스 기사의 읽기 난이도를 분석해주세요.
            
            기사 내용: {content}
            
            JSON 형식으로 출력:
            {{
                "level": "초급|중급|고급",
                "score": 1-10,
                "icon": "🟢|🟡|🔴",
                "reading_tips": [
                    "이해를 돕는 팁1",
                    "이해를 돕는 팁2"
                ]
            }}
        `);

		return RunnableSequence.from([
			difficultyPrompt,
			this.model,
			this.outputParser,
		]);
	}

	protected parseResult(result: string): any {
		return this.parseJsonSafely(result, {
			level: "중급",
			score: 5,
			icon: "🟡",
			reading_tips: [],
		});
	}
}
