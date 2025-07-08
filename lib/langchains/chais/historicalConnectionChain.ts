import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { BaseAnalysisChain } from "./baseAnalysisChain";

export class HistoricalConnectionChain extends BaseAnalysisChain {
	protected buildChain(): RunnableSequence {
		const historicalPrompt = PromptTemplate.fromTemplate(`
            다음 뉴스 기사와 관련된 과거의 유사한 사건을 분석해주세요.
            
            기사 내용: {content}
            
            JSON 형식으로 출력:
            {{
                "similar_events": [
                    {{
                        "date": "2020-03-15",
                        "title": "과거 사건 제목",
                        "similarity": "유사점 설명",
                        "outcome": "결과"
                    }}
                ],
                "patterns": "반복되는 패턴 분석",
                "lessons": [
                    "교훈1",
                    "교훈2"
                ]
            }}
        `);

		return RunnableSequence.from([
			historicalPrompt,
			this.model,
			this.outputParser,
		]);
	}

	protected parseResult(result: string): any {
		return this.parseJsonSafely(result, {
			similar_events: [],
			patterns: "분석 실패",
			lessons: [],
		});
	}
}
