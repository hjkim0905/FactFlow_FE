import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { BaseAnalysisChain } from "./baseAnalysisChain";

export class SummaryChain extends BaseAnalysisChain {
	protected buildChain(): RunnableSequence {
		const summaryPrompt = PromptTemplate.fromTemplate(`
            다음 뉴스 기사를 단계별로 요약해주세요.
            
            기사 내용: {content}
            
            JSON 형식으로 출력, 요청 형식은 아래 JSON 구조를 **엄격하게** 따라야 합니다. (마지막 쉼표 금지, 쌍따옴표 사용):
            {{
                "one_sentence": "핵심 메시지 한 문장",
                "three_sentences": [
                    "배경/원인",
                    "핵심 사건", 
                    "결과/영향"
                ],
                "five_sentences": [
                    "상세 배경",
                    "발생 과정",
                    "핵심 내용", 
                    "파급 효과",
                    "향후 전망"
                ]
            }}
        `);

		return RunnableSequence.from([
			summaryPrompt,
			this.model,
			this.outputParser,
		]);
	}

	protected parseResult(result: string): any {
		return this.parseJsonSafely(result, {
			one_sentence: "요약 생성 실패",
			three_sentences: ["요약 실패"],
			five_sentences: ["요약 실패"],
		});
	}
}
