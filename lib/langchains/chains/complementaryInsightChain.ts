import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { BaseAnalysisChain } from "./baseAnalysisChain";

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
추천 이유와 요약은 15자 이내여야합니다.

**중요한 JSON 작성 규칙:**
- 문자열 내 쌍따옴표(")는 반드시 \\\\"로 escape 하십시오
- 마지막 객체나 배열 항목 뒤에 쉼표(,)를 붙이지 마세요
- 모든 문자열은 쌍따옴표로 감싸야 합니다
- JSON 코드 블록(\`\`\`json) 없이 순수 JSON만 출력하세요

출력 형식:
{{
  "complementary_articles": [
    {{
      "icon":"제목에 알맞는 아이콘",
      "title": "기사 제목 (쌍따옴표는 \\\\"로 escape)",
      "why_useful": "보완적 유용성 설명",
      "summary": "해당 기사 요약",
      "source": "기사 링크",
      "publisher": "발행자",
    }}
  ],
  "insight": "전체적인 이슈 이해를 위한 시사점"
}}

기사 목록:
{articles}

핵심 키워드:
{keywords}
    `);

		return RunnableSequence.from([prompt, this.model, this.outputParser]);
	}
	private decodeHtmlEntities(str: string): string {
		return str
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&amp;/g, "&");
	}

	protected parseResult(result: string): unknown {
		// 1. HTML 엔티티(&quot;) 디코딩 처리
		const decodedResult = this.decodeHtmlEntities(result);

		// 2. 디버깅 로그
		console.log("✅ 디코딩된 LLM 결과:", decodedResult);

		// 3. JSON 파싱
		return this.parseJsonSafely(decodedResult, {
			complementary_articles: [],
			insight: "보완적 분석 없음",
		});
	}

	// ✅ 실행 함수: ProcessedNews[]를 받아 article 목록 텍스트 구성
	async run(input: {
		articles: ProcessedNews[];
		keywords: string[];
	}): Promise<unknown> {
		console.log("🔍 ComplementaryInsightChain 입력 확인:");
		console.log("📊 articles 길이:", input.articles.length);
		console.log("📊 keywords 길이:", input.keywords.length);

		if (input.articles.length === 0 || input.keywords.length === 0) {
			console.log("⚠️ articles 또는 keywords가 비어있어 기본값 반환");
			return {
				complementary_articles: [],
				insight: "관련 기사나 키워드가 없어 보완 분석을 제공할 수 없습니다.",
			};
		}

		const articleList =
			input.articles && input.articles.length > 0
				? input.articles
						.map(
							(a, i) =>
								`${i + 1}. ${a.title}\n요약: ${a.summary}\n링크: ${a.url}`,
						)
						.join("\n\n")
				: "없음";

		console.log("📝 articleList 길이:", articleList.length);
		console.log("📝 keywords 문자열:", input.keywords.join(", "));

		try {
			const result = await this.chain.invoke({
				articles: articleList || "없음",
				keywords:
					input.keywords && input.keywords.length > 0
						? input.keywords.join(", ")
						: "없음",
			});
			return this.parseResult(result);
		} catch (error: unknown) {
			console.error(`${this.constructor.name} 실행 오류:`, error);
			// 오류 발생 시 기본값 반환
			return {
				complementary_articles: [],
				insight: "보완 분석 중 오류가 발생했습니다.",
			};
		}
	}
}
