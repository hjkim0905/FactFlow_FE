import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

// 💡 타입 정의
type NewsItem = {
  title: string;
  link: string;
  description: string;
};

type ProcessedNews = {
  title: string;
  url: string;
  summary: string;
  similarityScore: number;
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
        model: "models/gemini-pro", // ✅ Gemini Pro
        apiKey: process.env.GOOGLE_API_KEY, // 반드시 환경변수 설정
        temperature: 0.3,
      })
  ) {}

  async run(input: {
    originalSummary: string;
    keywords: string[];
    similarArticles: ProcessedNews[];
  }): Promise<AnalysisResult> {
    const prompt = PromptTemplate.fromTemplate(`
다음은 최근 뉴스 기사 요약과 관련 키워드입니다.
아래는 유사한 뉴스 기사들의 요약과 제목입니다. 이들을 기반으로 유사한 사건들을 비교 분석해주세요.
가능하면 최근 사건을 우선적으로 정렬하고, 각각의 사건에 대해 간단한 설명과 결과, 출처를 포함해주세요.

원본 요약:
{summary}

주요 키워드:
{keywords}

유사 뉴스 목록:
{articles}

아래와 같은 JSON 형식으로 작성해주세요:
{
  "similar_events": [
    {
      "date": "사건 날짜",
      "title": "유사한 이슈 제목",
      "similarity": "유사점 설명",
      "outcome": "결과",
      "source": "언론사 이름 또는 기사 링크"
    }
  ],
  "patterns": "반복되는 패턴 분석",
  "lessons": ["교훈1", "교훈2"]
}
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
      patterns: z.string().default("없음"),
      lessons: z.array(z.string()).default([]),
    });

    const parser = StructuredOutputParser.fromZodSchema(schema);

    const chain = RunnableSequence.from([
      prompt,
      this.model,
      new StringOutputParser(),
      parser,
    ]);

    const articleSummaries = input.similarArticles
        .map(
            (a, idx) =>
                `${idx + 1}. ${a.title} - ${a.summary} (유사도: ${a.similarityScore.toFixed(2)})`
        )
        .join("\n");

    const result = await chain.invoke({
      summary: input.originalSummary,
      keywords: input.keywords.join(", "),
      articles: articleSummaries,
    });

    return result;
  }
}