import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { BaseAnalysisChain } from './baseAnalysisChain';

export class SummaryChain extends BaseAnalysisChain {
    protected buildChain(): RunnableSequence {
        const summaryPrompt = PromptTemplate.fromTemplate(`
            다음 뉴스 기사를 단계별로 요약해주세요.
             요약 지침:
            - "one_sentence"는 **15자 이내의 핵심 요약** 1문장
            - "three_sentences"는 **배경 / 핵심 사건 / 결과**를 각 1문장씩 정리 (총 3문장)
            - "five_sentences"는 **상세 흐름**을 5단계로 설명
            - "five_sentences_explanations"는 각 문장의 **의미를 간단히 설명**, 각 설명은 **100자 이내**
            
             출력 시 유의사항:
            - 반드시 **아래 JSON 구조**를 그대로 복사해 사용하세요
            - **모든 key와 string은 반드시 쌍따옴표로 감싸야 합니다**
            - **마지막 쉼표는 절대 추가하지 마세요**
            - 그 외 주석, 텍스트는 출력하지 마세요
            
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
                    "상세 배경 (15자 이내)",
                    "발생 과정 (15자 이내)",
                    "핵심 내용 (15자 이내)", 
                    "파급 효과 (15자 이내)",
                    "향후 전망 (15자 이내)"
                ],
                "five_sentences_explanations": [
                    "상세 배경 설명 (100자 이내)",
                    "발생 과정 설명 (100자 이내)",
                    "핵심 내용 설명 (100자 이내)",
                    "파급 효과 설명 (100자 이내)",
                    "향후 전망 설명 (100자 이내)"
                ]
            }}
        `);

        return RunnableSequence.from([summaryPrompt, this.model, this.outputParser]);
    }

    protected parseResult(result: string): unknown {
        return this.parseJsonSafely(result);
    }
}
