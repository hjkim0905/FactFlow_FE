import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { BaseAnalysisChain } from './baseAnalysisChain';

export class KeywordExtractionChain extends BaseAnalysisChain {
    protected buildChain(): RunnableSequence {
        const keywordPrompt = PromptTemplate.fromTemplate(`
            다음 뉴스 기사에서 중요한 키워드를 추출하고 중요도별로 분류해주세요.
            
            기사 내용: {content}
            
            JSON 형식으로 출력, 요청 형식은 아래 JSON 구조를 **엄격하게** 따라야 합니다. (마지막 쉼표 금지, 쌍따옴표 사용):
            {{
                "high_importance": [
                    {{
                        "keyword": "키워드",
                        "description": "설명",
                        "color": "#FF4444"
                    }}
                ],
                "medium_importance": [
                    {{
                        "keyword": "키워드", 
                        "description": "설명",
                        "color": "#FFAA44"
                    }}
                ],
                "low_importance": [
                    {{
                        "keyword": "키워드",
                        "description": "설명", 
                        "color": "#44AA44"
                    }}
                ]
            }}
        `);

        return RunnableSequence.from([keywordPrompt, this.model, this.outputParser]);
    }

    protected parseResult(result: string): unknown {
        return this.parseJsonSafely(result, {
            high_importance: [],
            medium_importance: [],
            low_importance: [],
        });
    }
}
