import React from 'react';
import Image from 'next/image';
import circle from '@/public/Ellipse 15.svg';

interface ThinkingQuestionsProps {
    questions: string[];
}

export default function ThinkingQuestions({ questions }: ThinkingQuestionsProps) {
    // questions가 undefined일 수 있으므로 안전하게 처리
    const safeQuestions = questions || [];
    const numImgs = ['/num1.png', '/num2.png', '/num3.png', '/num4.png'];
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black">
            <div className="flex items-center mb-4 gap-2">
                <span className="text-[2rem] leading-[1.9375rem]">👩🏻‍🏫</span>
                <h2 className="font-pretendard font-bold text-[0.75rem] leading-[0.875rem] text-[#4C4C4C]">
                    사고력을 길러주는 추천 질문이에요!
                </h2>
            </div>
            <div className="flex flex-col gap-2">
                {safeQuestions.slice(0, 4).map((q, i) => (
                    <div
                        key={`question-${i}-${q.substring(0, 10)}`}
                        className="flex items-center"
                        style={{
                            width: 313,
                            height: 23,
                            background: '#EBEBEB',
                            border: '0.6px solid #0073FF',
                            borderRadius: 40.06,
                            marginBottom: 12,
                            position: 'relative',
                            paddingLeft: 32, // 원형(22.56) + 여유
                            paddingRight: 12,
                        }}
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
            </div>
        </div>
    );
}
