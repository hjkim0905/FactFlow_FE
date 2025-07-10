import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import { StructuredOutputParser } from 'langchain/output_parsers';

// 💡 타입 정의
type ProcessedNews = {
    title: string;
    url: string;
    summary: string;
};

type AnalysisResult = {
    similar_events: {
        date: string;
        title: string;
        similarity: string;
        outcome: string;
        source: string;
    }[];
    patterns: string;
    lessons: string[];
};

export class HistoricalNewsPipeline {
    constructor(
        private readonly model = new ChatGoogleGenerativeAI({
            model: 'models/gemini-pro',
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.3,
        })
    ) {}

    // ✅ 유사도 계산 함수
    private async calculateSimilarity(summaryA: string, summaryB: string): Promise<number> {
        const prompt = PromptTemplate.fromTemplate(`
다음 두 문장의 의미 유사도를 0에서 1 사이의 소수로 숫자만 출력하세요.

문장 A: {{a}}
문장 B: {{b}}
`);

        const chain = prompt.pipe(this.model).pipe(new StringOutputParser());
        const result = await chain.invoke({ a: summaryA, b: summaryB });

        const score = parseFloat(result.trim());
        return isNaN(score) ? 0 : Math.max(0, Math.min(1, score));
    }

    // ✅ 전체 실행 함수
    async run(input: {
        originalSummary: string;
        keywords: string[];
        similarArticles: ProcessedNews[];
    }): Promise<AnalysisResult> {
        const prompt = PromptTemplate.fromTemplate(`
아래는 원본 뉴스 요약과 유사한 뉴스 기사들입니다. 이들을 기반으로 유사한 사건들의 공통점, 결과, 반복되는 패턴, 교훈을 도출해주세요.
각 사건에 대해 날짜, 제목, 유사성 설명, 결과, 기사 링크를 JSON 형식으로 정리해주세요.
기사 source 는 주어진 링크를 그대로 사용하세요.

원본 요약:
{{summary}}

주요 키워드:
{{keywords}}

유사 뉴스 목록 (최대 5개):
{{articles}}

아래 JSON 형식으로만 출력하세요. 설명이나 말머리는 없이 JSON만 출력하세요:
{{
  "similar_events": [
    {{
      "date": "사건 날짜",
      "title": "유사한 이슈 제목",
      "similarity": "유사점 설명",
      "outcome": "결과",
      "source": "기사 링크"
    }}
  ],
  "patterns": "반복되는 패턴 분석",
  "lessons": ["교훈1", "교훈2"]
}}
`);

        const schema = z.object({
            similar_events: z
                .array(
                    z.object({
                        date: z.string(),
                        title: z.string(),
                        similarity: z.string(),
                        outcome: z.string(),
                        source: z.string(),
                    })
                )
                .default([]),
            patterns: z.string().default('없음'),
            lessons: z.array(z.string()).default([]),
        });

        const parser = StructuredOutputParser.fromZodSchema(schema);

        const chain = RunnableSequence.from([prompt, this.model, new StringOutputParser(), parser]);

        // ✅ 유사도 계산
        const scored = await Promise.all(
            input.similarArticles.map(async (article) => {
                const score = await this.calculateSimilarity(input.originalSummary, article.summary);
                return {
                    title: article.title,
                    summary: article.summary,
                    score,
                    source: article.url,
                };
            })
        );

        // ✅ 유사도 상위 5개 추출
        const top5 = scored.sort((a, b) => b.score - a.score).slice(0, 5);

        const articleSummaries = top5
            .map((a, i) => `${i + 1}. ${a.title} - ${a.summary} (유사도: ${a.score.toFixed(2)})\n링크: ${a.source}`)
            .join('\n');

        console.log('🧾 final llm input check:', {
            summary: input.originalSummary,
            keywords: input.keywords.join(', '),
            articles: articleSummaries,
        });

        const result = await chain.invoke({
            summary: input.originalSummary,
            keywords: input.keywords.join(', '),
            articles: articleSummaries,
        });

        return result;
    }
}
