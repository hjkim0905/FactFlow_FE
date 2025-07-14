import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { BaseAnalysisChain } from './baseAnalysisChain';

export class ThinkingQuestionChain extends BaseAnalysisChain {
    protected buildChain(): RunnableSequence {
        const questionPrompt = PromptTemplate.fromTemplate(`
            당신은 사용자의 비판적 사고를 유도하는 교육용 질문 생성 도우미입니다.
            다음 뉴스 기사를 읽고 **논리적 사고를 자극하는 세 가지 질문 유형**에 따라 질문과 설명을 각각 2개씩 생성해주세요.
            
            각 항목은 반드시 다음 기준을 충족해야 합니다:
            - 각 질문은 **20자 이내의 짧은 문장**이어야 합니다 (예: "이 정책의 배경은?" 등)
            - 각 설명은 질문의 의도를 풀어주는 **문장 2~3개 수준의 짧은 해설**이어야 하며, 각 줄은 100자 이내
            - **JSON 형식을 엄격하게 지켜야 하며**, 마지막 쉼표는 절대 넣지 마세요.
            - **모든 키와 문자열은 반드시 쌍따옴표로 감싸야 합니다**
            
            
            기사 내용:
            {content}
            
            출력은 아래 JSON 형식을 **정확히 복사한 형태로 출력**하세요:
            {{
              "causal_questions": [
                "원인 분석 질문1",
                "원인 분석 질문2"
              ],
              "casual_explanations":[
                 "원인 분석 질문1에 대한 자세한 설명",
                "원인 분석 질문2에 대한 자세한 설명"
              ],
              "prediction_questions": [
                "결과 예측 질문1",
                "결과 예측 질문2",
               
              ],
              "prediction_explanations":[
                "결과 예측 질문1에 대한 설명",
                "결과 예측 질문2에 대한 설명"
              ],
              
              "perspective_questions": [
                "관점 비교 질문1",
                "관점 비교 질문2",
                
              ],
              "perspective_explanations": [
                "관점 비교 질문1에 대한 설명",
                "관점 비교 질문2에 대한 설명"
              ]
              
            }}
            오직 위와 같은 JSON 형식만 출력하세요. 주석, 설명, 텍스트 등은 일절 포함하지 마세요.
        `);

        return RunnableSequence.from([questionPrompt, this.model, this.outputParser]);
    }

    protected parseResult(result: string): unknown {
        return this.parseJsonSafely(result, {
            causal_questions: [],
            casual_explanations: [],
            prediction_questions: [],
            prediction_explanations: [],
            perspective_questions: [],
            perspective_explanations: [],
        });
    }
}
