import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

interface RelatedArticle {
    icon: string;
    publisher: string;
    title: string;
    url: string;
    summary: string;
}

interface RelatedArticlesProps {
    articles: RelatedArticle[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
    // articles가 undefined일 수 있으므로 안전하게 처리
    const safeArticles = useMemo(() => articles || [], [articles]);

    const cleanText = (text: string) =>
        text
            .replace(/\\?"/g, '"') // \" 또는 " → "
            .replace(/^"+|"+$/g, ''); // 맨 앞/뒤 " 모두 제거
    // 썸네일 상태: 각 기사별로 og:image URL 저장
    const [thumbnails, setThumbnails] = useState<(string | null)[]>(() =>
        Array.isArray(safeArticles) ? safeArticles.map(() => null) : []
    );

    useEffect(() => {
        if (!Array.isArray(safeArticles) || safeArticles.length === 0) {
            return;
        }

        safeArticles.forEach((article, idx) => {
            if (!article || !article.url) return;

            fetch(`/api/og-image?url=${encodeURIComponent(article.url)}`)
                .then((res) => res.json())
                .then((data) => {
                    setThumbnails((prev) => {
                        const next = [...prev];
                        next[idx] = data.image || null;
                        return next;
                    });
                })
                .catch(() => {
                    setThumbnails((prev) => {
                        const next = [...prev];
                        next[idx] = null;
                        return next;
                    });
                });
        });
    }, [safeArticles]);

    const FALLBACK_IMAGE = '/file.svg';

    return (
        <>
            <div className="p-6 text-black" style={{ background: '#2C2C2C', height: '343px', maxWidth: '100%' }}>
                <div className="flex items-center mb-4 w-full">
                    <span className="text-[2rem] leading-[1.9375rem] mr-3">📰</span>
                    <h2 className="font-pretendard font-bold text-[0.75rem] leading-[0.875rem] text-white">
                        동일 이슈 기사도 함께 볼까요?
                    </h2>
                    <span
                        className="font-pretendard font-medium ml-3"
                        style={{
                            fontSize: 8.86,
                            lineHeight: '11px',
                            color: '#C6C6C6',
                        }}
                    >
                        {safeArticles.length}건
                    </span>
                </div>
                {/* 가로 스크롤 기사 카드 영역 */}
                <div
                    className="w-full mt-6 md:mt-[30px] pb-2"
                    style={{ overflowX: 'auto', overflowY: 'visible', paddingTop: 12 }}
                >
                    <div className="flex gap-3 min-w-fit">
                        {safeArticles.map((article, idx) => (
                            <a
                                key={`${article.url}-${idx}`}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col min-w-[121px] max-w-[90vw] rounded-[12.09px] overflow-hidden cursor-pointer transition-all duration-200 bg-[#969696]"
                                style={{
                                    width: 131,
                                    height: 142,
                                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                                    background: '#969696',
                                    borderRadius: '12.09px',
                                    transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
                                    transform: 'translateY(0)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.width = '132.86px';
                                    e.currentTarget.style.height = '155.92px';
                                    e.currentTarget.style.boxShadow = '7px 4px 55px 0 #212121';
                                    e.currentTarget.style.background = '#0073FF';
                                    e.currentTarget.style.borderRadius = '13.27px';
                                    e.currentTarget.style.transform = 'translateY(-6.96px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.width = '131px';
                                    e.currentTarget.style.height = '142px';
                                    e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
                                    e.currentTarget.style.background = '#969696';
                                    e.currentTarget.style.borderRadius = '12.09px';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* 상단: 원형 + 뉴스회사명, 배경 #D9D9D9 (hover시에도 그대로) */}
                                <div className="flex items-center px-3 py-2 bg-[#D9D9D9] transition-colors duration-200">
                                    <div className="w-2 h-2 rounded-full bg-[#969696] transition-colors duration-200 group-hover:bg-[#0073FF]" />
                                    <span className="ml-2 text-[8px] leading-[7.16px] font-semibold text-[#252525] font-pretendard">
                                        {article.publisher}
                                    </span>
                                </div>
                                {/* 아래: 제목+썸네일 전체를 감싸는 영역, hover시 파란색 */}
                                <div className="flex-1 flex flex-col bg-[#969696] transition-colors duration-200 group-hover:bg-[#0073FF]">
                                    <div className="px-3 pt-2 pb-1 h-[43px] flex items-start">
                                        <div className="text-[9px] leading-[9.55px] font-semibold text-[#F7F7F7] font-pretendard break-words text-left w-full overflow-hidden">
                                            {cleanText(article.title)}
                                        </div>
                                    </div>
                                    <div className="px-3 pb-2">
                                        <Image
                                            src={thumbnails[idx] || FALLBACK_IMAGE}
                                            alt={article.title}
                                            width={115}
                                            height={60}
                                            className="w-full h-[60px] object-cover rounded-[8px]"
                                            unoptimized
                                            onError={(e) => {
                                                if (e.currentTarget.src !== FALLBACK_IMAGE) {
                                                    e.currentTarget.src = FALLBACK_IMAGE;
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            {/* 파란색 하단 바 (responsive, 109px desktop, rem on mobile) */}
            <div className="w-full bg-[#0073FF] flex items-center relative" style={{ height: '6.8125rem' }}>
                <div>
                    <span
                        className="font-pretendard font-bold text-white block"
                        style={{
                            fontSize: 15.31,
                            lineHeight: '18.27px',
                            marginLeft: '23px',
                            width: '180px',
                            height: '36px',
                            display: 'block',
                            textAlign: 'left',
                            whiteSpace: 'pre-line',
                        }}
                    >
                        안녕하세요! <span style={{ color: '#F8FF69' }}>뉴기</span>예요.
                        {'\n'}같이 생각해봐요.
                    </span>
                    <span
                        className="font-pretendard font-semibold"
                        style={{
                            fontSize: 8.28,
                            lineHeight: '12px',
                            color: '#EED',
                            display: 'block',
                            whiteSpace: 'pre-line',
                            marginLeft: '23px',
                            width: '200px',
                            height: '28px',
                            marginTop: '0.5rem',
                        }}
                    >
                        여러분의 뉴스 리터러시를 길러줄 ‘<span style={{ color: '#F8FF69' }}>뉴기</span>’에요.
                        <br />
                        기사를 보면서, 이런 질문을 해보면 어떨까요?
                    </span>
                </div>
                {/* NewgieNewsPaper 이미지: 파란색 div 맨 오른쪽, z-index로 맨 위, 약간 겹치게 */}
                <Image
                    src="/NewgieNewsPaper.png"
                    alt="Newgie News Paper"
                    width={289}
                    height={194}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '-2rem',
                        zIndex: 10,
                        maxWidth: '60vw',
                        minWidth: '140px',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                    }}
                    priority
                />
            </div>
        </>
    );
}
