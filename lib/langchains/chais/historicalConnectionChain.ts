import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { BaseAnalysisChain } from "./baseAnalysisChain";

export class HistoricalConnectionChain extends BaseAnalysisChain {
	protected buildChain(): RunnableSequence {
		const historicalPrompt = PromptTemplate.fromTemplate(`
            다음 뉴스 기사와 관련된 과거의 유사한 사건을 분석해주세요.
           최근 기사일수록 상단에 위치하게 정렬해주세요.
			뉴스 출처는 명확하게 명시해주세요. (가능하면 URL 포함)
			JSON을 엄격하게 출력하세요.
			
            
            기사 내용: {content}
            주요 카워드: {keywords}
            JSON 형식으로 출력, 요청 형식은 아래 JSON 구조를 **엄격하게** 따라야 합니다. (마지막 쉼표 금지, 쌍따옴표 사용):
            {{
                "similar_events": [
                    {{
                        "date": "사건 날짜",
						  "title": "비슷한 이슈 제목",
						  "similarity": "유사점 설명",
						  "outcome": "결과",
						  "source": "기사 출처 (언론사, 제목, URL 포함 가능)"
                        
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
