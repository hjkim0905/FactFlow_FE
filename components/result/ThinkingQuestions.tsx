import React, { useRef } from 'react';
import Image from 'next/image';
import circle from '@/public/Ellipse 15.svg';

interface ThinkingQuestionsProps {
    questions: string[];
    explanations?: string[];
}

export default function ThinkingQuestions({ questions, explanations }: ThinkingQuestionsProps) {
    const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
    const safeQuestions = questions || [];
    const safeExplanations = explanations || [];
    const numImgs = ['/num1.png', '/num2.png', '/num3.png', '/num4.png'];
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lastRow = rowRefs.current[safeQuestions.slice(0, 4).length - 1];
    const overlayHeight = lastRow ? lastRow.offsetTop + lastRow.offsetHeight : '100%';
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black">
            <div className="flex items-center mb-4 gap-2">
                <span className="text-[2rem] leading-[1.9375rem]">👩🏻‍🏫</span>
                <h2 className="font-pretendard font-bold text-[0.75rem] leading-[0.875rem] text-[#4C4C4C]">
                    사고력을 길러주는 추천 질문이에요!
                </h2>
            </div>
            <div className="flex flex-col gap-2 relative w-[330px]">
                {safeQuestions.slice(0, 4).map((q, i) => (
                    <div
                        ref={(el) => {
                            rowRefs.current[i] = el;
                        }}
                        key={`question-${i}-${q.substring(0, 10)}`}
                        className="flex items-center"
                        style={{
                            width: 329,
                            height: 23,
                            background: '#EBEBEB',
                            border: '0.6px solid #0073FF',
                            borderRadius: 40.06,
                            marginBottom: 12,
                            position: 'relative',
                            paddingLeft: 32, // 원형(22.56) + 여유
                            paddingRight: 12,
                            zIndex: 1,
                            cursor: 'pointer',
                        }}
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        onFocus={() => setHoveredIdx(i)}
                        onBlur={() => setHoveredIdx(null)}
                        tabIndex={0}
                    >
                        {/* 파란 원 + 숫자 */}
                        <div
                            className="absolute top-1/2 left-0 flex items-center justify-center"
                            style={{
                                width: 22.56,
                                height: 22.56,
                                borderRadius: '50%',
                                transform: 'translateY(-50%)',
                                flexShrink: 0,
                            }}
                        >
                            <Image
                                src={circle}
                                alt="파란 원"
                                width={22.56}
                                height={22.56}
                                style={{ width: 22.56, height: 22.56 }}
                                draggable={false}
                                aria-hidden
                            />
                            <Image
                                src={numImgs[i]}
                                alt={`숫자${i + 1}`}
                                width={19}
                                height={18}
                                style={{
                                    position: 'absolute',
                                    left: '35%',
                                    top: '65%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 20,
                                    height: 20,
                                    filter: 'drop-shadow(0px 1.61px 1.61px rgba(0,0,0,0.25))',
                                }}
                                draggable={false}
                                aria-hidden
                            />
                        </div>
                        {/* 질문 텍스트 */}
                        <span
                            style={{
                                fontFamily: 'Pretendard, sans-serif',
                                fontWeight: 500,
                                fontSize: 13,
                                color: '#222',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {q}
                        </span>
                    </div>
                ))}
                {/* Hover Overlay: covers all questions */}
                {hoveredIdx !== null && rowRefs.current[hoveredIdx] && (
                    <div
                        className="z-30 w-[330px] flex flex-col justify-start px-0 py-0"
                        style={{
                            background: 'rgba(68, 79, 91, 0.8)',
                            border: '2px solid #0073FF',
                            borderRadius: 11,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none',
                            height: overlayHeight,
                        }}
                    >
                        {/* Overlay: absolutely position the blue circle/number at the exact same spot as the original row */}
                        <div
                            style={{
                                position: 'absolute',
                                left: -2,
                                top:
                                    rowRefs.current[hoveredIdx]?.offsetTop +
                                    (rowRefs.current[hoveredIdx]?.offsetHeight || 23) / 2 -
                                    22.56 / 2 -
                                    2,
                                width: 22.56,
                                height: 22.56,
                                zIndex: 40,
                                pointerEvents: 'none',
                            }}
                        >
                            <Image
                                src={circle}
                                alt="파란 원"
                                width={22.56}
                                height={22.56}
                                style={{ width: 22.56, height: 22.56 }}
                                draggable={false}
                                aria-hidden
                            />
                            <Image
                                src={numImgs[hoveredIdx]}
                                alt={`숫자${hoveredIdx + 1}`}
                                width={19}
                                height={18}
                                style={{
                                    position: 'absolute',
                                    left: '35%',
                                    top: '65%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 20,
                                    height: 20,
                                    filter: 'drop-shadow(0px 1.61px 1.61px rgba(0,0,0,0.25))',
                                }}
                                draggable={false}
                                aria-hidden
                            />
                        </div>
                        {/* 질문 텍스트 */}
                        <div
                            className="font-pretendard font-semibold text-[11px] text-white text-left"
                            style={{
                                lineHeight: '13.13px',
                                marginTop: 6,
                                maxWidth: '100%',
                                width: '100%',
                                paddingLeft: 31,
                                paddingRight: 26,
                                whiteSpace: 'pre-line',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {safeQuestions[hoveredIdx]}
                        </div>
                        {/* 설명 텍스트 */}
                        <div
                            className="font-pretendard font-normal text-[9px] text-white text-left"
                            style={{
                                lineHeight: '10.74px',
                                marginTop: 11,
                                maxWidth: '100%',
                                width: '100%',
                                paddingLeft: 31,
                                paddingRight: 26,
                                wordBreak: 'keep-all',
                                overflow: 'hidden',
                                display: 'block',
                            }}
                        >
                            {safeExplanations[hoveredIdx]}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
