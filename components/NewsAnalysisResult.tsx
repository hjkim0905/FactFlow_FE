'use client';

import CoreSummary from './result/CoreSummary';
import KeywordHighlight from './result/KeywordHighlight';
import EmotionMix from './result/EmotionMix';
import RelatedArticles from './result/RelatedArticles';
import ThinkingQuestions from './result/ThinkingQuestions';
import ReconsiderationPoint from './result/ReconsiderationPoint';
import DeepConnectionInfo from './result/DeepConnectionInfo';
import Warning from './result/Warning';
import type { NewsAnalysisResponse } from '../types/newAnalysis';
type Keyword = {
    keyword: string;
    description: string;
    color: string;
};
type ComplementaryArticle = {
    title: string;
    why_useful: string;
    summary: string;
    source: string;
};
import type { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import vectorimage from '@/public/resultvector.svg';

interface Props {
    result: NewsAnalysisResponse;
    setUrl: Dispatch<SetStateAction<string>>;
    handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => Promise<void>;
    loading: boolean;
    clearResult: () => void;
}

export default function NewsAnalysisResults({ result, setUrl, handlePaste, loading, clearResult }: Props) {
    // 타입 단언 및 구조 분해
    const { analysis, extracted_content } = result;

    const titleRewrite = analysis.title_rewrite as { rewritten_title: string };
    const summary = analysis.summary as { one_sentence: string; three_sentences: string[]; five_sentences: string[] };
    const keywords = analysis.keywords as {
        high_importance: Keyword[];
        medium_importance: Keyword[];
        low_importance: Keyword[];
    };
    const difficulty = analysis.difficulty as { level: string; score: number };
    const expression = analysis.expression as { [key: string]: number };
    const thinkingQuestions = analysis.thinking_questions as {
        causal_questions?: string[];
        prediction_questions?: string[];
        perspective_questions?: string[];
    };
    const complementaryInsight = analysis.complementary_insight as { complementary_articles: ComplementaryArticle[] };

    return (
        <div className="flex flex-col ">
            {/* 헤더와 새로운 URL 입력 */}
            <div>
                <div className="flex flex-col items-center mt-3 mb-4">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="url"
                            className="w-[275px] text-center h-[31px] text-[11.281px] font-bold text-[#ADADAD] border-2 border-[#777] rounded-full px-6 py-3 bg-white shadow pr-12"
                            placeholder="기사의 URL 링크를 이곳에 붙여주세요!"
                            onChange={(e) => setUrl(e.target.value)}
                            onPaste={handlePaste}
                            disabled={loading}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Image src={vectorimage} alt="분석 버튼" className="w-[22px] h-[24px]" />
                        </div>
                    </div>
                </div>
                <header
                    className="bg-blue-600 w-full text-white py-2 text-center font-bold flex flex-col items-center cursor-pointer select-none mb-6"
                    onClick={clearResult}
                >
                    <p className="text-[10px] font-bold tracking-wide">NEWSEE</p>
                </header>
            </div>
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
                {titleRewrite.rewritten_title}
            </div>
            {/* 기사 입력일 */}
            <div className="w-[16.125rem] max-w-full mx-auto text-left font-pretendard text-[0.7rem] leading-[0.687rem] text-[#979797] mb-1 font-normal pl-2">
                기사입력 {extracted_content.publish_date}
            </div>
            {/* 기자명 */}
            <div className="w-[16.125rem] max-w-full mx-auto text-left font-pretendard text-[0.7rem] leading-[0.687rem] text-[#979797] font-normal pl-2">
                {extracted_content.author}
            </div>
            <CoreSummary
                summary={summary.one_sentence}
                three_sentences={summary.three_sentences}
                difficulty={difficulty}
            />
            <KeywordHighlight
                keywords={[
                    ...(keywords.high_importance || []),
                    ...(keywords.medium_importance || []),
                    ...(keywords.low_importance || []),
                ].slice(0, 8)}
            />
            <EmotionMix
                objectivePercent={expression['percentage of objective statement']}
                subjectivePercent={expression['percentage of subjective statement']}
            />
            <RelatedArticles
                articles={complementaryInsight.complementary_articles.map((a) => ({
                    title: a.title,
                    url: a.source,
                    summary: a.summary,
                }))}
            />
            <ThinkingQuestions
                questions={[
                    ...(thinkingQuestions.causal_questions || []),
                    ...(thinkingQuestions.prediction_questions || []),
                    ...(thinkingQuestions.perspective_questions || []),
                ]}
            />
            <Warning />
            <ReconsiderationPoint points={summary.five_sentences} />
            <Warning />
            <DeepConnectionInfo
                infos={complementaryInsight.complementary_articles.map((a) => ({
                    title: a.title,
                    description: a.why_useful,
                    url: a.source,
                }))}
            />
        </div>
    );
}
