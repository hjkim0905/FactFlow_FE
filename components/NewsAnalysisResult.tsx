'use client';

import CoreSummary from './result/CoreSummary';
import KeywordHighlight from './result/KeywordHighlight';
import EmotionMix from './result/EmotionMix';
import RelatedArticles from './result/RelatedArticles';
import ThinkingQuestions from './result/ThinkingQuestions';
import ReconsiderationPoint from './result/ReconsiderationPoint';
import DeepConnectionInfo from './result/DeepConnectionInfo';
import Warning from './result/Warning';
import type { NewsAnalysisResponse } from '../types/newsAnalysisResponse';
import type { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import vectorimage from '@/public/resultvector.svg';
import { cleanAuthorName } from '@/lib/utils';

interface Props {
    result: NewsAnalysisResponse;
    setUrl: Dispatch<SetStateAction<string>>;
    handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => Promise<void>;
    loading: boolean;
}

export default function NewsAnalysisResults({ result, setUrl, handlePaste, loading }: Props) {
    if (!result || !result.analysis || !result.extracted_content) {
        console.warn('⚠️ result가 유효하지 않습니다:', result);
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500">분석 결과를 불러올 수 없습니다.</p>
            </div>
        );
    }

    const analysis = result.analysis as NewsAnalysisResponse['analysis'];
    const extracted_content = result.extracted_content as NewsAnalysisResponse['extracted_content'];

    const titleRewrite = analysis.title_rewrite ?? {
        original_title: '제목 없음',
        rewritten_title: '제목 없음',
        removed_expressions: [],
        change_reason: '',
        category: '',
        authors: '',
    };
    const summary = analysis.summary ?? {
        one_sentence: '요약 없음',
        three_sentences: [],
        five_sentences: [],
    };
    const keywords = analysis.keywords ?? {
        high_importance: [],
        medium_importance: [],
        low_importance: [],
    };
    const difficulty = analysis.difficulty ?? {
        level: '보통',
        score: 0,
        icon: '',
        reading_tips: [],
    };
    const expression = analysis.expression ?? {
        'percentage of objective statement': 0,
        'percentage of subjective statement': 0,
    };
    const thinkingQuestions = analysis.thinking_questions ?? {
        causal_questions: [],
        prediction_questions: [],
        perspective_questions: [],
    };
    const complementaryInsight = analysis.complementary_insight ?? {
        complementary_articles: [],
        insight: '',
    };

    return (
        <div className="flex flex-col ">
            {/* 헤더와 새로운 URL 입력 */}
            <div className="sticky top-0 z-50 bg-gray-50">
                {/* URL 입력창 */}
                <div className="flex flex-col items-center mt-3 mb-4">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="url"
                            className="w-[275px] text-center h-[31px] text-[11.281px] font-medium text-[#ADADAD] border-[#777] rounded-full px-6 py-3 bg-white shadow pr-12 border-[0.5px]"
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
                {/* NEWSEE 배너 */}
                <div className="w-full bg-[#0073FF] py-2 flex flex-col items-center cursor-pointer select-none border-none">
                    <p
                        className="text-[10px] font-bold tracking-wide text-white"
                        style={{ fontFamily: 'Paperlogy-8ExtraBold, Pretendard, sans-serif' }}
                    >
                        NEWSEE
                    </p>
                </div>
            </div>
            {/* 카테고리 라벨 */}
            <div className="flex justify-center items-center w-full mt-3">
                <div
                    className="border-blue-500 rounded-full w-12 h-5 mb-2 flex items-center justify-center box-border border-[1.21px]"
                    style={{
                        minWidth: '3rem',
                        minHeight: '1.1875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <span
                        className="font-bold text-[0.705rem] text-[#4C4C4C]"
                        style={{
                            fontFamily: 'Pretendard',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            lineHeight: '100%',
                        }}
                    >
                        {titleRewrite.category}
                    </span>
                </div>
            </div>
            {/* 기사 제목 (rewritten_title) */}
            <div className="w-[16.125rem] max-w-full mx-auto text-center font-bold font-pretendard text-[1.25rem] leading-[1.46] tracking-tight text-[#323232] break-keep mb-4 ">
                {titleRewrite.rewritten_title}
            </div>
            {/* 기사 입력일 */}
            <div className="w-[16.125rem] max-w-full mx-auto text-left font-pretendard text-[0.7rem] leading-[0.687rem] text-[#979797] mb-1 font-normal pl-2">
                기사입력 {extracted_content.publishDate ?? '날짜 없음'}
            </div>
            {/* 기자명 */}
            <div className="w-[16.125rem] max-w-full mx-auto text-left font-pretendard text-[0.7rem] leading-[0.687rem] text-[#979797] font-normal pl-2">
                {extracted_content.author != null
                    ? cleanAuthorName(extracted_content.author)
                    : cleanAuthorName(analysis.title_rewrite.authors ?? '')}
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
                objectivePercent={expression['percentage of objective statement'] ?? 0}
                subjectivePercent={expression['percentage of subjective statement'] ?? 0}
            />
            <RelatedArticles
                articles={(complementaryInsight.complementary_articles || []).map((a) => ({
                    icon: a.icon || '',
                    publisher: a.publisher || '',
                    title: a.title || '',
                    url: a.source || '',
                    summary: a.summary || '',
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
            <ReconsiderationPoint points={summary.five_sentences || []} />
            <Warning />
            <DeepConnectionInfo
                infos={(complementaryInsight.complementary_articles || []).map((a) => ({
                    title: a.title || '',
                    description: a.why_useful || '',
                    url: a.source || '',
                    publisher: a.publisher || '',
                }))}
            />
        </div>
    );
}
