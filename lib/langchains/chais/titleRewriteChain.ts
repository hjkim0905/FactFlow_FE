import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { BaseAnalysisChain } from './baseAnalysisChain';

export class TitleRewriteChain extends BaseAnalysisChain {
    protected buildChain(): RunnableSequence {
        const titlePrompt = PromptTemplate.fromTemplate(`
            다음 뉴스 기사의 제목을 자극적인 표현 없이 이슈 중심으로 객관적으로 다시 작성해주세요.
            
            기사 제목: {title}
            기사 내용: {content}
            
            JSON 형식으로 출력, 요청 형식은 아래 JSON 구조를 **엄격하게** 따라야 합니다. (마지막 쉼표 금지, 쌍따옴표 사용):
            {{
                "original_title": "원본 제목",
                "rewritten_title": "재구성된 제목", 
                "removed_expressions": ["제거된 자극적 표현들"],
                "change_reason": "변경 사유"
            }}
        `);

        return RunnableSequence.from([titlePrompt, this.model, this.outputParser]);
    }

    protected parseResult(result: string): unknown {
        return this.parseJsonSafely(result, {
            original_title: '제목을 찾을 수 없습니다',
            rewritten_title: '제목 재구성 실패',
            removed_expressions: [],
            change_reason: '분석 실패',
        });
    }
}
