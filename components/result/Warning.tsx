import React from 'react';

const WarningSet = () => (
    <>
        {/* 두 개 겹친 삼각형 느낌표 SVG */}
        <span className="flex items-center relative" style={{ width: '2.2rem', height: '1rem' }}>
            <svg
                width="16"
                height="13"
                viewBox="0 0 16 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ position: 'relative', left: 0 }}
            >
                <polygon points="8,0 16,13 0,13" fill="#fff" />
                <text x="8" y="10" textAnchor="middle" fontSize="8" fill="#0073FF" fontWeight="bold">
                    !
                </text>
            </svg>
            <svg
                width="16"
                height="13"
                viewBox="0 0 16 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ position: 'relative', left: '-0.3rem' }}
            >
                <polygon points="8,0 16,13 0,13" fill="#fff" />
                <text x="8" y="10" textAnchor="middle" fontSize="8" fill="#0073FF" fontWeight="bold">
                    !
                </text>
            </svg>
        </span>
        {/* NEWSEE 텍스트 */}
        <span
            className="font-pretendard font-bold text-white"
            style={{
                fontSize: '0.705rem',
                lineHeight: '0.8125rem',
                width: '3rem',
                minWidth: '2.5rem',
                display: 'inline-block',
                textAlign: 'left',
                fontFamily: 'Pretendard',
            }}
        >
            NEWSEE
        </span>
        {/* WARNING 텍스트 */}
        <span
            className="font-pretendard font-bold text-white"
            style={{
                fontSize: '0.705rem',
                lineHeight: '0.8125rem',
                width: '3.3rem',
                minWidth: '2.7rem',
                display: 'inline-block',
                textAlign: 'left',
                fontFamily: 'Pretendard',
            }}
        >
            WARNING
        </span>
    </>
);

export default function Warning() {
    // 12세트 반복 (최소 400% 너비)
    return (
        <div
            className="w-full overflow-hidden bg-[#0073FF] flex items-center"
            style={{ height: '1.375rem', position: 'relative' }}
        >
            <div
                className="flex items-center gap-6 animate-warning-marquee"
                style={{
                    minWidth: '400%',
                    width: '400%',
                    animation: 'warning-marquee 24s linear infinite',
                }}
            >
                {Array.from({ length: 12 }).map((_, i) => (
                    <WarningSet key={i} />
                ))}
            </div>
            <style jsx>{`
                @keyframes warning-marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                .animate-warning-marquee {
                    will-change: transform;
                }
            `}</style>
        </div>
    );
}
