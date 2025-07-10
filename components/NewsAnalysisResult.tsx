'use client';

import CoreSummary from './result/CoreSummary';
import KeywordHighlight from './result/KeywordHighlight';
import EmotionMix from './result/EmotionMix';
import RelatedArticles from './result/RelatedArticles';
import ThinkingQuestions from './result/ThinkingQuestions';
import ReconsiderationPoint from './result/ReconsiderationPoint';
import DeepConnectionInfo from './result/DeepConnectionInfo';
import type { NewsAnalysisResponse } from '../types/newsAnalysisResponse';

export default function NewsAnalysisResults({ result }: { result: unknown }) {
    const r = result as NewsAnalysisResponse;
    return (
        <div className="flex flex-col ">
            {/* 카테고리 라벨 */}
            <div className="flex justify-center items-center w-full">
                <div
                    className="border border-blue-500 rounded-full w-12 h-5 mb-2 flex items-center justify-center box-border"
                    style={{ minWidth: '3rem', minHeight: '1.1875rem' }}
                >
                    <span className="font-bold text-[0.705rem] leading-[0.8125rem] text-[#4C4C4C] font-pretendard">
                        정치
                    </span>
                </div>
            </div>
            {/* 기사 제목 (rewritten_title) */}
            <div className="w-[16.125rem] max-w-full mx-auto text-center font-bold font-pretendard text-[1.25rem] leading-[1.46] tracking-tight text-[#323232] break-keep mb-4 ">
                {r.analysis.title_rewrite.rewritten_title}
            </div>
            {/* 기사 입력일 */}
            <div className="w-[16.125rem] max-w-full mx-auto text-left font-pretendard text-[0.7rem] leading-[0.687rem] text-[#979797] mb-1 font-normal pl-2">
                기사입력 {r.extracted_content.publishDate}
            </div>
            {/* 기자명 */}
            <div className="w-[16.125rem] max-w-full mx-auto text-left font-pretendard text-[0.7rem] leading-[0.687rem] text-[#979797] mb-4 font-normal pl-2">
                김현지 기자
            </div>
            <CoreSummary summary={r.analysis.summary.one_sentence} />
            <KeywordHighlight keywords={r.analysis.keywords.high_importance} />
            <EmotionMix
                positive={r.analysis.expression.emotional_analysis.positive_ratio}
                negative={r.analysis.expression.emotional_analysis.negative_ratio}
                neutral={r.analysis.expression.emotional_analysis.neutral_ratio}
            />
            <RelatedArticles
                articles={r.analysis.complementary_insight.complementary_articles.map((a) => ({
                    title: a.title,
                    url: a.source,
                    summary: a.summary,
                }))}
            />
            <ThinkingQuestions
                questions={[
                    ...(r.analysis.thinking_questions.causal_questions || []),
                    ...(r.analysis.thinking_questions.prediction_questions || []),
                    ...(r.analysis.thinking_questions.perspective_questions || []),
                ]}
            />
            <ReconsiderationPoint points={r.analysis.summary.five_sentences} />
            <DeepConnectionInfo
                infos={r.analysis.complementary_insight.complementary_articles.map((a) => ({
                    title: a.title,
                    description: a.why_useful,
                    url: a.source,
                }))}
            />
        </div>
    );
}
