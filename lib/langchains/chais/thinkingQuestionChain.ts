import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { BaseAnalysisChain } from './baseAnalysisChain';

export class ThinkingQuestionChain extends BaseAnalysisChain {
    protected buildChain(): RunnableSequence {
        const questionPrompt = PromptTemplate.fromTemplate(`
            다음 뉴스 기사를 읽은 사용자의 비판적 사고를 유도하는 질문을 생성해주세요.
            질문은 20글자 내외로 생성하세요.
            기사 내용: {content}
            
            JSON 형식으로 출력, 요청 형식은 아래 JSON 구조를 **엄격하게** 따라야 합니다. (마지막 쉼표 금지, 쌍따옴표 사용):
            {{
                "causal_questions": [
                    "원인 분석 질문1",
                    "원인 분석 질문2"
                ],
                "prediction_questions": [
                    "결과 예측 질문1",
                    "결과 예측 질문2"
                ],
                "perspective_questions": [
                    "관점 비교 질문1",
                    "관점 비교 질문2"
                ]
            }}
        `);

        return RunnableSequence.from([questionPrompt, this.model, this.outputParser]);
    }

    protected parseResult(result: string): unknown {
        return this.parseJsonSafely(result, {
            causal_questions: [],
            prediction_questions: [],
            perspective_questions: [],
        });
    }
}
