import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { BaseAnalysisChain } from './baseAnalysisChain';

// 📌 기사 타입 정의
type ProcessedNews = {
    title: string;
    url: string;
    summary: string;
};

export class ComplementaryInsightChain extends BaseAnalysisChain {
    protected buildChain(): RunnableSequence {
        const prompt = PromptTemplate.fromTemplate(`
다음은 하나의 뉴스 주제와 관련된 여러 기사입니다. 
이 중에서 직접적으로 유사한 사건은 아니더라도,
- 이슈의 배경을 잘 설명하거나
- 대안적/반대적 관점을 제공하거나
- 사건을 더 깊이 이해하는 데 도움이 되는
보완적 기사들을 선별해 주세요.

각 기사는 아래 형식의 JSON 배열로 정리해 주세요.
각 항목에는 추천 이유, 간단한 요약, 기사 링크가 포함되어야 합니다.

아래 형식으로만 출력하세요. 설명 없이 JSON만 출력하세요, 요청 형식은 아래 JSON 구조를 **엄격하게** 따라야 합니다. (마지막 쉼표 금지, 쌍따옴표 사용):
{{
  "complementary_articles": [
    {{
      "title": "기사 제목",
      "why_useful": "왜 이 기사가 보완적으로 유용한지 설명",
      "summary": "해당 기사 요약",
      "source": "기사 링크"
    }}
  ],
  "insight": "전체적으로 이 이슈를 더 잘 이해하기 위해 어떤 흐름 또는 시사점을 참고하면 좋은지 요약"
}}

기사 목록:
{articles}

핵심 키워드:
{keywords}
    `);

        return RunnableSequence.from([prompt, this.model, this.outputParser]);
    }

    protected parseResult(result: string): unknown {
        return this.parseJsonSafely(result, {
            complementary_articles: [],
            insight: '보완적 분석 없음',
        });
    }

    // ✅ 실행 함수: ProcessedNews[]를 받아 article 목록 텍스트 구성
    async run(input: { articles: ProcessedNews[]; keywords: string[] }): Promise<unknown> {
        const articleList = input.articles
            .map((a, i) => `${i + 1}. ${a.title}\n요약: ${a.summary}\n링크: ${a.url}`)
            .join('\n\n');

        return await this.invoke({
            content: articleList,
            title: input.keywords.join(', '),
        });
    }
}
